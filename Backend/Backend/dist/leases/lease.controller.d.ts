import { LeaseService } from './lease.service';
import { SignLeaseDto } from './dto/sign-lease.dto';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { Request } from 'express';
import { User } from '../iam/users/entities/user.entity';
import { UnitsService } from '../units/units.service';
interface AuthRequest extends Request {
    user?: User;
}
export declare class LeaseController {
    private readonly leaseService;
    private readonly unitService;
    constructor(leaseService: LeaseService, unitService: UnitsService);
    reqLease(propertyId: number, unitId: number, CreateLeaseDto: CreateLeaseDto, req: AuthRequest): Promise<import("./lease.entity").Lease>;
    signLease(propertyId: number, unitId: number, signLeaseDto: SignLeaseDto, req: AuthRequest): Promise<{
        message: string;
        leaseId: string;
        unitId: number;
        unitStatus: string;
    }>;
    getLeaseByPropertyAndUnit(propertyId: number, unitId: number, req: any): Promise<import("./lease.entity").Lease | null>;
    getAllLeases(): Promise<import("./lease.entity").Lease[]>;
    getLeasesByTenant(tenantId: number): Promise<import("./lease.entity").Lease[]>;
    getLeasesByOwner(ownerId: number): Promise<import("./lease.entity").Lease[]>;
    getLeaseById(id: string): Promise<import("./lease.entity").Lease>;
    deleteLease(id: number): Promise<void>;
}
export {};
