import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './payment.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Lease } from '../leases/lease.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    @InjectRepository(Lease)
    private readonly leaseRepository: Repository<Lease>,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const tenantId = dto.tenantId;
    if (
      tenantId === undefined || 
      (typeof tenantId !== 'number' && typeof tenantId !== 'string') ||
      (typeof tenantId === 'string' && isNaN(Number(tenantId)))
    ) {
      throw new BadRequestException('Invalid tenant ID');
    }

    const tenantIdNumber = typeof tenantId === 'string' ? Number(tenantId) : tenantId;

    // Fetch tenant, including leases
    const tenant = await this.tenantRepository.findOne({ 
      where: { id: tenantIdNumber },
      relations: ['leases'], // load leases relation
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    let lease: Lease | null = null;
    if (dto.leaseId) {
      if (typeof dto.leaseId !== 'string') {
        throw new BadRequestException('Invalid lease ID');
      }
      lease = await this.leaseRepository.findOne({ where: { id: dto.leaseId } });
      if (!lease) throw new NotFoundException('Lease not found');
    } else {
      // Optional: If leaseId not provided, pick first active lease (if any)
      lease = tenant.leases.length > 0 ? tenant.leases[0] : null;
    }

    const toDate = (dateStr?: string): Date | undefined => {
      if (!dateStr) return undefined;
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? undefined : date;
    };

    const paymentData: Partial<Payment> = {
      tenant,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: dto.status || 'unpaid',
      referenceNumber: dto.referenceNumber,
      notes: dto.notes,
      dueDate: toDate(dto.dueDate),
      paidDate: dto.status === 'paid' ? new Date() : toDate(dto.paidDate),
      month: dto.month,
      date: toDate(dto.date),
    };

    if (lease) {
      paymentData.lease = lease;

      if (lease.unit?.monthlyRent) {
        (paymentData as any).monthlyRent = lease.unit.monthlyRent;
      }
    }

    const payment = this.paymentRepository.create(paymentData);
    return this.paymentRepository.save(payment);
  }

  async deletePayment(id: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    await this.paymentRepository.remove(payment);
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: [
        'tenant',
        'lease',
        'lease.property',
        'lease.property.owner',
        'lease.unit',
      ],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async getPaymentsByTenant(tenantId: number): Promise<Payment[]> {
    const id = Number(tenantId);
    if (isNaN(id)) throw new BadRequestException('Invalid tenant ID');

    return this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.lease', 'lease')
      .leftJoinAndSelect('lease.tenant', 'tenant')
      .leftJoinAndSelect('lease.property', 'property')
      .leftJoinAndSelect('lease.unit', 'unit')
      .where('lease.tenantId = :id', { id })
      .orderBy('payment.date', 'DESC')
      .getMany();
  }

  async getPaymentsByLease(leaseId: string): Promise<Payment[]> {
    if (!leaseId) throw new BadRequestException('Invalid lease ID');

    return this.paymentRepository.find({
      where: { lease: { id: leaseId } },
      relations: [
        'tenant',
        'lease',
        'lease.property',
        'lease.property.owner',
        'lease.unit',
      ],
    });
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: [
        'tenant',
        'lease',
        'lease.property',
        'lease.property.owner',
        'lease.unit',
      ],
    });
  }
}
