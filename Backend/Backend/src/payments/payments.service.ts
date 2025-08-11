import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './payment.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Lease } from '../leases/lease.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

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
    const tenantId = Number(dto.tenantId);
    if (isNaN(tenantId)) throw new BadRequestException('Invalid tenant ID');

    const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');


    const payment = this.paymentRepository.create({
      tenant,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: dto.status || 'unpaid',
      referenceNumber: dto.referenceNumber,
      notes: dto.notes,
      dueDate: dto.dueDate,
      paidDate: dto.paidDate,
      month: dto.month,
      date: dto.date,
    });

    return this.paymentRepository.save(payment);
  }

  // async updatePayment(id: string, dto: UpdatePaymentDto): Promise<Payment> {
  //   const payment = await this.paymentRepository.findOne({ where: { id } });
  //   if (!payment) throw new NotFoundException('Payment not found');

  //   if (dto.tenantId) {
  //     const tenant = await this.tenantRepository.findOne({ where: { id: Number(dto.tenantId) } });
  //     if (!tenant) throw new NotFoundException('Tenant not found');
  //     payment.tenant = tenant;
  //   }

  //   if (dto.leaseId) {
  //     const lease = await this.leaseRepository.findOne({ where: { id: Number(dto.leaseId) } });
  //     if (!lease) throw new NotFoundException('Lease not found');
  //     payment.lease = lease;
  //   }

  //   Object.assign(payment, dto);
  //   return this.paymentRepository.save(payment);
  // }

  async deletePayment(id: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.paymentRepository.remove(payment);
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['tenant', 'lease'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async getPaymentsByTenant(tenantId: string): Promise<Payment[]> {
    const id = Number(tenantId);
    if (isNaN(id)) throw new BadRequestException('Invalid tenant ID');

    return this.paymentRepository.find({
      where: { tenant: { id } },
      relations: ['tenant', 'lease'],
    });
  }

  async getPaymentsByLease(leaseId: string): Promise<Payment[]> {
    const id = Number(leaseId);
    if (isNaN(id)) throw new BadRequestException('Invalid lease ID');

    return this.paymentRepository.find({
      where: { lease: { id } },
      relations: ['tenant', 'lease'],
    });
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find({ relations: ['tenant', 'lease'] });
  }
}
