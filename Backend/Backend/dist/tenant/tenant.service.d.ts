import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { Payment } from '../payments/payment.entity';
import { MaintenanceRequest } from './maintenance/maintenance.entity';
import { Amenity } from '../amenity/amenity.entity';
import { MailService } from '../auth/email/mail.service';
import { SignupDto } from './dto/create-tenant.dto';
import { Landlord } from '../landlord/landlord.entity';
export declare class TenantService {
    private tenantRepo;
    private paymentRepo;
    private maintenanceRepo;
    private amenityRepo;
    private landlordRepo;
    private mailService;
    constructor(tenantRepo: Repository<Tenant>, paymentRepo: Repository<Payment>, maintenanceRepo: Repository<MaintenanceRequest>, amenityRepo: Repository<Amenity>, landlordRepo: Repository<Landlord>, mailService: MailService);
    private hashPassword;
    private generateOtp;
    private getOtpExpiry;
    private sendOtpEmail;
    findByEmail(email: string): Promise<Tenant | null>;
    findById(id: number): Promise<Tenant>;
    createTenant(dto: SignupDto): Promise<Tenant>;
    verifyOtp(email: string, otp: string): Promise<{
        message: string;
    }>;
    resendOtp(email: string): Promise<{
        message: string;
    }>;
    findAll(): Promise<Tenant[]>;
    updateTenant(id: number, updateData: Partial<Tenant>): Promise<Tenant>;
    updateRefreshToken(tenantId: number, refreshToken: string): Promise<void>;
    deleteTenant(id: number): Promise<{
        message: string;
    }>;
    getTenantsByPropertyId(propertyId: number): Promise<Tenant[]>;
    getPaymentsByTenantId(tenantId: number): Promise<Payment[]>;
    getMaintenanceByTenantId(tenantId: number): Promise<MaintenanceRequest[]>;
    getAmenitiesByTenantId(tenantId: number): Promise<Amenity[]>;
    getLandlordByTenantId(tenantId: number): Promise<Landlord>;
    getDashboardData(tenantId: number): Promise<{
        profile: Tenant;
        payments: Payment[];
        maintenance: MaintenanceRequest[];
        amenities: Amenity[];
        landlord: Landlord;
    }>;
    getRentalInfo(tenantId: number): Promise<{
        property?: undefined;
        unit?: undefined;
        leaseStart?: undefined;
        leaseEnd?: undefined;
        monthlyRent?: undefined;
        deposit?: undefined;
        status?: undefined;
    } | {
        property: {
            name: string | null;
        };
        unit: string | null;
        leaseStart: Date;
        leaseEnd: Date;
        monthlyRent: number | null;
        deposit: number | null;
        status: import("../leases/lease.entity").LeaseStatus;
    }>;
}
