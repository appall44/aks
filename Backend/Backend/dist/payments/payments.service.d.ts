import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Lease } from '../leases/lease.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsService {
    private readonly paymentRepository;
    private readonly tenantRepository;
    private readonly leaseRepository;
    constructor(paymentRepository: Repository<Payment>, tenantRepository: Repository<Tenant>, leaseRepository: Repository<Lease>);
    createPayment(dto: CreatePaymentDto): Promise<Payment>;
    deletePayment(id: string): Promise<void>;
    getPaymentById(id: string): Promise<Payment>;
    getPaymentsByTenant(tenantId: string): Promise<Payment[]>;
    getPaymentsByLease(leaseId: string): Promise<Payment[]>;
    getAllPayments(): Promise<Payment[]>;
}
