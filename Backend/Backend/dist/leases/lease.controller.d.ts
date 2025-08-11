import { LeaseService } from './lease.service';
import { SignLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { Request } from 'express';
import { User } from '../iam/users/entities/user.entity';
interface AuthRequest extends Request {
    user?: User;
}
export declare class LeaseController {
    private readonly leaseService;
    constructor(leaseService: LeaseService);
    createLease(createLeaseDto: SignLeaseDto, req: AuthRequest): Promise<import("./lease.entity").Lease>;
    signLease(propertyId: number, unitId: number, signLeaseDto: SignLeaseDto, req: AuthRequest): Promise<import("./lease.entity").Lease>;
    getAllLeases(): Promise<import("./lease.entity").Lease[]>;
    getLeasesByTenant(tenantId: number): Promise<import("./lease.entity").Lease[]>;
    getLeasesByOwner(ownerId: number): Promise<import("./lease.entity").Lease[]>;
    getLeaseById(id: number): Promise<import("./lease.entity").Lease>;
    updateLease(id: number, updateLeaseDto: UpdateLeaseDto): Promise<import("./lease.entity").Lease>;
    deleteLease(id: number): Promise<void>;
    getLeaseByPropertyAndUnit(propertyId: number, unitId: number): Promise<import("./lease.entity").Lease>;
}
export {};
