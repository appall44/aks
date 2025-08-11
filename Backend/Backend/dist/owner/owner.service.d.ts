import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { Property } from '../properties/entities/property.entity';
import { MaintenanceRequest } from '../tenant/maintenance/maintenance.entity';
import { Lease } from '../leases/lease.entity';
import { Payment } from '../payments/payment.entity';
export declare class OwnerService {
    private ownerRepo;
    private propertyRepo;
    private maintenanceRepo;
    private leaseRepo;
    private paymentRepo;
    constructor(ownerRepo: Repository<Owner>, propertyRepo: Repository<Property>, maintenanceRepo: Repository<MaintenanceRequest>, leaseRepo: Repository<Lease>, paymentRepo: Repository<Payment>);
    findByEmail(email: string): Promise<Owner | null>;
    createOwner(dto: CreateOwnerDto): Promise<Owner>;
    updateOwner(id: number, data: Partial<Owner>): Promise<Owner | null>;
    deleteOwner(id: number): Promise<import("typeorm").DeleteResult>;
    verifyOwner(id: number): Promise<Owner>;
    saveOwner(owner: Owner): Promise<Owner>;
    findPendingOwners(): Promise<Owner[]>;
    updateRefreshToken(id: number, refreshToken: string): Promise<void>;
    findAll(): Promise<Owner[]>;
    findById(id: number): Promise<Owner>;
    getMaintenanceNotifications(ownerId: number): Promise<{
        id: number;
        title: string;
        message: string;
        date: Date;
        type: string;
        priority: import("../tenant/maintenance/maintenance.entity").Priority;
        status: string;
        property: string;
    }[]>;
    getRecentActivities(ownerId: number): Promise<({
        id: string;
        type: string;
        message: string;
        date: string;
        status: string;
        amount: string;
        tenantId: number;
    } | {
        id: number;
        type: string;
        message: string;
        date: Date;
        priority: import("../tenant/maintenance/maintenance.entity").Priority;
        status: string;
        tenantName: string;
        property: string;
    })[]>;
    getPropertyPerformance(ownerId: number): Promise<{
        propertyName: string;
        totalRevenue: number;
        occupancyRate: number;
        trend: string;
    }[]>;
}
