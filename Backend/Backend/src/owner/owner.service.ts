// src/owners/owner.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThanOrEqual } from 'typeorm';
import { Owner } from './entities/owner.entity';
import { AccountStatus } from 'src/iam/users/enums/account-status.enum';
import * as bcrypt from 'bcrypt';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { Property } from '../properties/entities/property.entity';
import { MaintenanceRequest } from '../tenant/maintenance/maintenance.entity';
import { Lease } from '../leases/lease.entity'; 
import { Payment } from '../payments/payment.entity';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private ownerRepo: Repository<Owner>,
    @InjectRepository(Property)
    private propertyRepo: Repository<Property>,
    @InjectRepository(MaintenanceRequest)
    private maintenanceRepo: Repository<MaintenanceRequest>,
    @InjectRepository(Lease)
    private leaseRepo: Repository<Lease>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async findByEmail(email: string): Promise<Owner | null> {
    return this.ownerRepo.findOne({ where: { email } });
  }

  async createOwner(dto: CreateOwnerDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const owner = this.ownerRepo.create({
      ...dto,
      password: hashedPassword,
      status: AccountStatus.PENDING,
    });
    return this.ownerRepo.save(owner);
  }

  async updateOwner(id: number, data: Partial<Owner>) {
    await this.ownerRepo.update(id, data);
    return this.ownerRepo.findOneBy({ id });
  }

  async deleteOwner(id: number) {
    return this.ownerRepo.delete(id);
  }

  async verifyOwner(id: number) {
    const owner = await this.findById(id);
    owner.status = AccountStatus.APPROVED;
    owner.verified = true;
    return this.ownerRepo.save(owner);
  }

  async saveOwner(owner: Owner) {
    return this.ownerRepo.save(owner);
  }

  async findPendingOwners() {
    return this.ownerRepo.find({
      where: { status: AccountStatus.PENDING },
    });
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const owner = await this.findById(id);
    owner.refreshToken = refreshToken;
    await this.ownerRepo.save(owner);
  }

  async findAll() {
    return this.ownerRepo.find();
  }

  async findById(id: number): Promise<Owner> {
    const owner = await this.ownerRepo.findOne({ where: { id } });
    if (!owner) throw new NotFoundException('Owner not found');
    return owner;
  }

  async getMaintenanceNotifications(ownerId: number) {
    const owner = await this.ownerRepo.findOne({
      where: { id: ownerId },
      relations: ['properties'],
    });

    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const propertyIds = owner.properties.map((property) => property.id);

    const maintenanceRequests = await this.maintenanceRepo.find({
      where: {
        property: { id: In(propertyIds) },
      },
      relations: ['tenant', 'property'],
      order: { createdAt: 'DESC' },
    });

    const notifications = maintenanceRequests.map((req) => ({
      id: req.id,
      title: `Maintenance Request from ${req.tenant?.firstname ?? ''} ${req.tenant?.lastname ?? ''}`,
      message: req.description,
      date: req.createdAt,
      type: 'maintenance',
      priority: req.priority,
      status: req.status === 'completed' ? 'read' : 'unread',
      property: req.property?.name ?? 'Unknown',
    }));

    return notifications;
  }

  async getRecentActivities(ownerId: number) {
    const properties = await this.propertyRepo.find({
      where: { owner: { id: ownerId } },
    });

    const propertyIds = properties.map((p) => p.id);
    if (propertyIds.length === 0) return [];

    // Payments
    const payments = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.lease', 'lease')
      .innerJoin('lease.property', 'property')
      .where('property.id IN (:...propertyIds)', { propertyIds })
      .orderBy('payment.date', 'DESC')
      .limit(10)
      .getMany();

   const paymentActivities = payments.map((p) => ({
  id: p.id,
  type: 'Payment Received',
  message: `Payment of ${p.amount.toLocaleString()} ETB from tenant ID ${p.lease.tenantId}`,
  date: p.date.toISOString(),  // rename from time to date here
  status: 'success',
  amount: `${p.amount} ETB`,
  tenantId: p.lease.tenantId,
}));


    // Maintenance Requests
    const maintenanceRequests = await this.maintenanceRepo.find({
      where: { property: { id: In(propertyIds) } },
      relations: ['tenant', 'property'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    const maintenanceActivities = maintenanceRequests.map((req) => ({
      id: req.id,
      type: 'Maintenance Request',
      message: req.description,
      date: req.createdAt,
      priority: req.priority,
      status: req.status === 'completed' ? 'completed' : 'pending',
      tenantName: `${req.tenant?.firstname ?? ''} ${req.tenant?.lastname ?? ''}`.trim(),
      property: req.property?.name ?? 'Unknown',
    }));

   const combined = [...paymentActivities, ...maintenanceActivities].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);


    return combined.slice(0, 10); 
  }

  async getPropertyPerformance(ownerId: number) {
    const properties = await this.propertyRepo.find({
      where: { owner: { id: ownerId } },
    });
    if (properties.length === 0) return [];

    const today = new Date();

    const performances = await Promise.all(
      properties.map(async (property) => {
        const revenueResult = await this.paymentRepo
          .createQueryBuilder('payment')
          .innerJoin('payment.lease', 'lease')
          .where('lease.propertyId = :propertyId', { propertyId: property.id })
          .select('SUM(payment.amount)', 'total')
          .getRawOne();

        const totalRevenue = Number(revenueResult.total) || 0;

        const activeLeasesCount = await this.leaseRepo.count({
          where: {
            property: { id: property.id },
            startDate: MoreThanOrEqual(today),
            endDate: MoreThanOrEqual(today),
          },
        });

        const totalUnits = (property as any).totalUnits || 100;

        const occupancyRate = totalUnits
          ? Math.round((activeLeasesCount / totalUnits) * 100)
          : 0;

        const trend = 'stable';

        return {
          propertyName: property.name,
          totalRevenue,
          occupancyRate,
          trend,
        };
      }),
    );

    return performances;
  }
}
