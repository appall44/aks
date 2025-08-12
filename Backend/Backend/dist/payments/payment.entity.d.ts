import { Tenant } from '../tenant/entities/tenant.entity';
import { Lease } from 'src/leases/lease.entity';
export declare class Payment {
    id: string;
    tenant: Tenant;
    lease: Lease;
    amount: number;
    MonthlyRent?: number;
    paymentMethod: string;
    status: 'paid' | 'unpaid';
    referenceNumber?: string;
    notes?: string;
    dueDate?: Date;
    paidDate?: Date;
    month?: string;
    createdAt: Date;
    date: Date;
}
