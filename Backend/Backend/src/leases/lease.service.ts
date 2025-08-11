import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lease } from './lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { User } from '../iam/users/entities/user.entity';
import { SignLeaseDto } from './dto/create-lease.dto';


@Injectable()
export class LeaseService {
  constructor(
    @InjectRepository(Lease)
    private leaseRepository: Repository<Lease>,

    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,

    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,

    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}



  async findAllLeases(): Promise<Lease[]> {
    return this.leaseRepository.find({ relations: ['tenant', 'user', 'property', 'unit'] });
  }

  async findLeaseById(id: number): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({ where: { id }, relations: ['tenant', 'user', 'property', 'unit'] });
    if (!lease) throw new NotFoundException(`Lease with ID ${id} not found`);
    return lease;
  }

  async updateLease(id: number, updateData: UpdateLeaseDto): Promise<Lease> {
    const lease = await this.findLeaseById(id);

    if (updateData.startDate) lease.startDate = new Date(updateData.startDate);
    if (updateData.endDate) lease.endDate = new Date(updateData.endDate);
    if (updateData.rentAmount !== undefined) lease.rentAmount = updateData.rentAmount;

    // Update other fields as needed

    await this.leaseRepository.save(lease);
    return lease;
  }

  async deleteLease(id: number): Promise<void> {
    const result = await this.leaseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Lease with ID ${id} not found`);
  }

  async findLeaseByPropertyAndUnit(propertyId: number, unitId: number): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: {
        property: { id: propertyId },
        unit: { id: unitId }
      },
      relations: ['property', 'unit', 'tenant'],
    });
    if (!lease) throw new NotFoundException(`Lease not found for property ${propertyId} and unit ${unitId}`);
    return lease;
  }

  async findLeasesByOwner(ownerId: number): Promise<Lease[]> {
    return this.leaseRepository.find({
      where: { property: { owner: { id: ownerId } } },
      relations: ['tenant', 'property', 'unit'],
    });
  }

  async findLeasesByTenant(tenantId: number) {
    return this.leaseRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['tenant', 'property', 'unit'],
    });
  }

  async signLease(leaseData: Partial<Lease>, user: User) {
  // Find lease by property, unit, and tenant (user.id)
  let lease = await this.leaseRepository.findOne({
    where: {
      property: { id: leaseData.propertyId },
      unit: { id: leaseData.unitId },
      tenant: { id: user.id },
    },
  });

  if (!lease) {
    // Optionally throw or create a new lease
    throw new NotFoundException('Lease not found for signing');
  }

  lease.paymentMethod = leaseData.paymentMethod;
  lease.digitalSignature = leaseData.digitalSignature;

  await this.leaseRepository.save(lease);

  return lease;
}

}
