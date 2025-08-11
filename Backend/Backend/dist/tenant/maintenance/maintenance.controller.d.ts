import { MaintenanceRequestService } from './maintenance.service';
import { CreateMaintenanceRequestDto } from './dto/maintenance-request.dto';
import { TenantService } from '../tenant.service';
export declare class MaintenanceRequestController {
    private readonly maintenanceService;
    private readonly tenantService;
    constructor(maintenanceService: MaintenanceRequestService, tenantService: TenantService);
    createMaintenanceRequest(tenantId: number, dto: CreateMaintenanceRequestDto): Promise<import("./maintenance.entity").MaintenanceRequest>;
    getMaintenanceRequests(tenantId: number): Promise<import("./maintenance.entity").MaintenanceRequest[]>;
}
