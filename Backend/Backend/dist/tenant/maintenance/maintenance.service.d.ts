import { Repository } from 'typeorm';
import { MaintenanceRequest } from './maintenance.entity';
import { CreateMaintenanceRequestDto } from './dto/maintenance-request.dto';
import { Tenant } from '../entities/tenant.entity';
import { Property } from '../../properties/entities/property.entity';
import { Landlord } from '../../landlord/landlord.entity';
import { User } from '../../iam/users/entities/user.entity';
export declare class MaintenanceRequestService {
    private readonly maintenanceRepo;
    private readonly tenantRepo;
    private readonly propertyRepo;
    private readonly landlordRepo;
    private readonly userRepo;
    constructor(maintenanceRepo: Repository<MaintenanceRequest>, tenantRepo: Repository<Tenant>, propertyRepo: Repository<Property>, landlordRepo: Repository<Landlord>, userRepo: Repository<User>);
    createMaintenanceRequest(dto: CreateMaintenanceRequestDto, tenant: Tenant): Promise<MaintenanceRequest>;
    findByTenant(tenant: Tenant): Promise<MaintenanceRequest[]>;
}
