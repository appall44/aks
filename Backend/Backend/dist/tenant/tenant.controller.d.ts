import { TenantService } from './tenant.service';
import { SignupDto } from './dto/create-tenant.dto';
import { Payment } from '../payments/payment.entity';
import { MaintenanceRequest } from './maintenance/maintenance.entity';
import { Amenity } from '../amenity/amenity.entity';
import { Landlord } from '../landlord/landlord.entity';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    getAllTenants(): Promise<import("./entities/tenant.entity").Tenant[]>;
    getTenantById(id: number): Promise<import("./entities/tenant.entity").Tenant>;
    updateTenant(id: number, updateData: any): Promise<{
        message: string;
        updated: import("./entities/tenant.entity").Tenant;
    }>;
    deleteTenant(id: number): Promise<{
        message: string;
    }>;
    registerTenant(dto: SignupDto): Promise<{
        message: string;
    }>;
    verifyOtp(body: {
        email: string;
        otp: string;
    }): Promise<{
        message: string;
    }>;
    resendOtp(body?: {
        email?: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<import("./entities/tenant.entity").Tenant>;
    getTenantPayments(req: any): Promise<Payment[]>;
    getMaintenanceRequests(req: any): Promise<MaintenanceRequest[]>;
    getAmenities(req: any): Promise<Amenity[]>;
    getLandlordInfo(req: any): Promise<Landlord>;
}
