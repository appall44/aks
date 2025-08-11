import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardStats(req: any): Promise<{
        totalProperties: number;
        totalRevenue: number;
        occupancyRate: number;
        activeTenants: number;
    }>;
}
