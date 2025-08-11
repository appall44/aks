import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Payment } from '../payments/payment.entity';
import { Lease } from '../leases/lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Lease)
    private readonly leaseRepository: Repository<Lease>,

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async getOwnerDashboardStats(ownerId: number) {
    const totalProperties = await this.propertyRepository.count({
      where: { ownerId },
    });

    const revenueResult = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.property', 'property')
      .where('property.ownerId = :ownerId', { ownerId })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    const totalRevenue = Number(revenueResult?.total) || 0;

    const unitsResult = await this.propertyRepository
      .createQueryBuilder('property')
      .where('property.ownerId = :ownerId', { ownerId })
      .select('SUM(property.totalUnits)', 'totalUnits')
      .getRawOne();

    const totalUnits = Number(unitsResult?.totalUnits) || 0;

    const leasedUnitsResult = await this.leaseRepository
      .createQueryBuilder('lease')
      .innerJoin('lease.property', 'property')
      .where('property.ownerId = :ownerId', { ownerId })
      .andWhere('lease.isActive = true')
      .select('COUNT(lease.id)', 'leasedUnits')
      .getRawOne();

    const leasedUnits = Number(leasedUnitsResult?.leasedUnits) || 0;

    const occupancyRate = totalUnits === 0 ? 0 : (leasedUnits / totalUnits) * 100;

    const activeTenants = await this.tenantRepository
      .createQueryBuilder('tenant')
      .innerJoin('tenant.property', 'property')
      .where('property.ownerId = :ownerId', { ownerId })
      .andWhere('tenant.isActive = true')
      .getCount();

    return {
      totalProperties,
      totalRevenue,
      occupancyRate: Math.round(occupancyRate),
      activeTenants,
    };
  }
}
