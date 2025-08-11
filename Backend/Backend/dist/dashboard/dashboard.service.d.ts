import { Repository } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { Payment } from '../payments/payment.entity';
import { Lease } from '../leases/lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
export declare class DashboardService {
    private readonly propertyRepository;
    private readonly paymentRepository;
    private readonly leaseRepository;
    private readonly tenantRepository;
    constructor(propertyRepository: Repository<Property>, paymentRepository: Repository<Payment>, leaseRepository: Repository<Lease>, tenantRepository: Repository<Tenant>);
    getOwnerDashboardStats(ownerId: number): Promise<{
        totalProperties: number;
        totalRevenue: number;
        occupancyRate: number;
        activeTenants: number;
    }>;
}
