import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lease } from './lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { User } from '../iam/users/entities/user.entity';
import { SignLeaseDto } from './dto/sign-lease.dto';
import {CreateLeaseDto} from './dto/create-lease.dto'
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

async createLease(leaseData: Partial<CreateLeaseDto>, user: User) {
  const tenantId = leaseData.tenantId || user.id;

  let lease = await this.leaseRepository.findOne({
    where: {
      propertyId: leaseData.propertyId,
      unitId: leaseData.unitId,
      tenantId: tenantId,
    },
  });

  if (!lease) {
    lease = new Lease();

    lease.tenantId = tenantId;
    lease.propertyId = leaseData.propertyId!;
    lease.unitId = leaseData.unitId!;

    // userId no longer used; remove this line:
    // lease.userId = user.id;

    if (!leaseData.startDate) {
      throw new Error('startDate is required');
    }
    if (!leaseData.endDate) {
      throw new Error('endDate is required');
    }

    lease.startDate = new Date(leaseData.startDate);
    lease.endDate = new Date(leaseData.endDate);
    lease.rentAmount = leaseData.rentAmount!;
    lease.status = leaseData.status || 'active';

    if (leaseData.digitalSignature) {
      lease.digitalSignature = leaseData.digitalSignature;
    }
  } else {
    if (leaseData.digitalSignature !== undefined) {
      lease.digitalSignature = leaseData.digitalSignature;
    }
    if (leaseData.status !== undefined) {
      lease.status = leaseData.status;
    }
    if (leaseData.startDate) {
      lease.startDate = new Date(leaseData.startDate);
    }
    if (leaseData.endDate) {
      lease.endDate = new Date(leaseData.endDate);
    }
    if (leaseData.rentAmount !== undefined) {
      lease.rentAmount = leaseData.rentAmount;
    }
  }

  await this.leaseRepository.save(lease);

  return lease;
}


  async findAllLeases(): Promise<Lease[]> {
    return this.leaseRepository.find({ relations: ['tenant', 'user', 'property', 'unit'] });
  }


async updateLease(id: string, updateData: Partial<Lease>): Promise<Lease> {
  const lease = await this.leaseRepository.findOneBy({ id });
  if (!lease) {
    throw new NotFoundException(`Lease with id ${id} not found`);
  }

  // Exclude id from updateData if accidentally included
  const { id: _, ...fieldsToUpdate } = updateData;

  Object.assign(lease, fieldsToUpdate);

  return this.leaseRepository.save(lease);
}


async findByPropertyAndUnit(propertyId: number, unitId: number) {
  return this.leaseRepository.findOne({
    where: {
      propertyId,
      unitId,
    },
    relations: ['tenant', 'property', 'unit'],  
  });
}

async findLeaseById(id: string): Promise<Lease> {
  const lease = await this.leaseRepository.findOne({
    where: { id },
    relations: ['tenant', 'user', 'property', 'unit'],
  });
  if (!lease) throw new NotFoundException(`Lease with ID ${id} not found`);
  return lease;
}


  // Uncomment and modify if you want to allow updates
  // async updateLease(id: number, updateData: UpdateLeaseDto): Promise<Lease> {
  //   const lease = await this.findLeaseById(id);
  //
  //   if (updateData.startDate) lease.startDate = new Date(updateData.startDate);
  //   if (updateData.endDate) lease.endDate = new Date(updateData.endDate);
  //   if (updateData.rentAmount !== undefined) lease.rentAmount = updateData.rentAmount;
  //   if (updateData.status) lease.status = updateData.status;
  //   if (updateData.paymentMethod !== undefined) lease.paymentMethod = updateData.paymentMethod;
  //   if (updateData.digitalSignature !== undefined) lease.digitalSignature = updateData.digitalSignature;
  //
  //   await this.leaseRepository.save(lease);
  //   return lease;
  // }

  async deleteLease(id: number): Promise<void> {
    const result = await this.leaseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Lease with ID ${id} not found`);
  }

  async findLeaseByPropertyAndUnit(propertyId: number, unitId: number): Promise<Lease> {
    const lease = await this.leaseRepository.findOne({
      where: { propertyId, unitId },
      relations: ['property', 'unit', 'tenant', 'user'],
    });
    if (!lease) throw new NotFoundException(`Lease not found for property ${propertyId} and unit ${unitId}`);
    return lease;
  }

  async findLeasesByOwner(ownerId: number): Promise<Lease[]> {
    return this.leaseRepository.find({
      where: { property: { owner: { id: ownerId } } },
      relations: ['tenant', 'property', 'unit', 'user'],
    });
  }

  async findLeasesByTenant(tenantId: number): Promise<Lease[]> {
    return this.leaseRepository.find({
      where: { tenantId },
      relations: ['tenant', 'property', 'unit', 'user'],
    });
  }
}
