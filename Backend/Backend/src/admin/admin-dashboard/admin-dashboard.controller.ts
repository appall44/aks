import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminDashboardService } from "./admin-dashboard.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../shared/decorators/roles.decorator";
import { Role } from "../../shared/enums/role.enum";

@Controller("admin/dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminDashboardController {
	constructor(private readonly adminDashboardService: AdminDashboardService) {}

	@Get()
	getDashboard() {
		return this.adminDashboardService.getAdminStats();
	}
}
