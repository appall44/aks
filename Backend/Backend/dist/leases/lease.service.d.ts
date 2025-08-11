import { Repository } from 'typeorm';
import { Lease } from './lease.entity';
import { Tenant } from '../tenant/entities/tenant.entity';
import { Property } from '../properties/entities/property.entity';
import { Unit } from '../units/entities/unit.entity';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { User } from '../iam/users/entities/user.entity';
export declare class LeaseService {
    private leaseRepository;
    private tenantRepository;
    private propertyRepository;
    private unitRepository;
    constructor(leaseRepository: Repository<Lease>, tenantRepository: Repository<Tenant>, propertyRepository: Repository<Property>, unitRepository: Repository<Unit>);
    findAllLeases(): Promise<Lease[]>;
    findLeaseById(id: number): Promise<Lease>;
    updateLease(id: number, updateData: UpdateLeaseDto): Promise<Lease>;
    deleteLease(id: number): Promise<void>;
    findLeaseByPropertyAndUnit(propertyId: number, unitId: number): Promise<Lease>;
    findLeasesByOwner(ownerId: number): Promise<Lease[]>;
    findLeasesByTenant(tenantId: number): Promise<Lease[]>;
    signLease(leaseData: Partial<Lease>, user: User): Promise<Lease>;
}
