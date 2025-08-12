import { Repository } from 'typeorm';
import { Lease } from './lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
import { User } from '../iam/users/entities/user.entity';
import { CreateLeaseDto } from './dto/create-lease.dto';
export declare class LeaseService {
    private leaseRepository;
    private tenantRepository;
    private propertyRepository;
    private unitRepository;
    constructor(leaseRepository: Repository<Lease>, tenantRepository: Repository<Tenant>, propertyRepository: Repository<Property>, unitRepository: Repository<Unit>);
    createLease(leaseData: Partial<CreateLeaseDto>, user: User): Promise<Lease>;
    findAllLeases(): Promise<Lease[]>;
    updateLease(id: string, updateData: Partial<Lease>): Promise<Lease>;
    findByPropertyAndUnit(propertyId: number, unitId: number): Promise<Lease | null>;
    findLeaseById(id: string): Promise<Lease>;
    deleteLease(id: number): Promise<void>;
    findLeaseByPropertyAndUnit(propertyId: number, unitId: number): Promise<Lease>;
    findLeasesByOwner(ownerId: number): Promise<Lease[]>;
    findLeasesByTenant(tenantId: number): Promise<Lease[]>;
}
