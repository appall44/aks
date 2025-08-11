import { Controller, Get, UseGuards } from '@nestjs/common';
import { OwnerDashboardService } from './owner-dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum'; 

@Controller('owner/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.OWNER)  
export class OwnerDashboardController {
  constructor(private readonly ownerDashboardService: OwnerDashboardService) {}

  @Get()
  getDashboard() {
    return this.ownerDashboardService.getOwnerStats();
  }
}
