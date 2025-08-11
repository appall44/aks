import { Controller, Post, Get, Param, ParseIntPipe, Body, NotFoundException } from '@nestjs/common';
import { MaintenanceRequestService } from './maintenance.service';
import { CreateMaintenanceRequestDto } from './dto/maintenance-request.dto';
import { TenantService } from '../tenant.service';

@Controller('tenant/:tenantId/maintenance')
export class MaintenanceRequestController {
  constructor(
    private readonly maintenanceService: MaintenanceRequestService,
    private readonly tenantService: TenantService,
  ) {}

  @Post()
  async createMaintenanceRequest(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() dto: CreateMaintenanceRequestDto,
  ) {
    const tenant = await this.tenantService.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${tenantId} not found`);
    }
    return this.maintenanceService.createMaintenanceRequest(dto, tenant);
  }

  @Get()
  async getMaintenanceRequests(
    @Param('tenantId', ParseIntPipe) tenantId: number,
  ) {
    const tenant = await this.tenantService.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${tenantId} not found`);
    }
    return this.maintenanceService.findByTenant(tenant);
  }
}
