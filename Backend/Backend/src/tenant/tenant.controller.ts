import {
  Controller,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Delete,
  Body,
  UseGuards,
  NotFoundException,
  Post,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/shared/enums/role.enum';
import { SignupDto } from './dto/create-tenant.dto';

// Import entity classes (not your custom types)
import { Payment } from '../payments/payment.entity';
import { MaintenanceRequest } from './maintenance/maintenance.entity';
import { Amenity } from '../amenity/amenity.entity';
import { Landlord } from '../landlord/landlord.entity';

@Controller()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // Admin protected routes

  @Get('admin/tenant')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllTenants() {
    return this.tenantService.findAll();
  }

  @Get('admin/tenant/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getTenantById(@Param('id', ParseIntPipe) id: number) {
    const tenant = await this.tenantService.findById(id);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  @Patch('admin/tenant/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateTenant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
  ) {
    const updated = await this.tenantService.updateTenant(id, updateData);
    return { message: 'Tenant updated successfully', updated };
  }

  @Delete('admin/tenant/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteTenant(@Param('id', ParseIntPipe) id: number) {
    return this.tenantService.deleteTenant(id);
  }

  // Tenant signup and OTP verification

  @Post('tenant/signup')
  async registerTenant(@Body() dto: SignupDto) {
    await this.tenantService.createTenant(dto);
    return { message: 'OTP sent to your email' };
  }

  @Post('tenant/verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    const verified = await this.tenantService.verifyOtp(body.email, body.otp);
    if (!verified) throw new BadRequestException('Invalid or expired OTP');
    return { message: 'Tenant verified successfully' };
  }

  @Post('tenant/resend-otp')
  async resendOtp(@Body() body?: { email?: string }) {
    if (!body || !body.email) {
      throw new BadRequestException('Email must be required');
    }
    await this.tenantService.resendOtp(body.email);
    return { message: 'OTP resent to your email' };
  }


  @UseGuards(JwtAuthGuard)
  @Get('tenant/me')
  async getProfile(@Req() req) {
    const tenantId = req.user.id;
    const profile = await this.tenantService.findById(tenantId);
    if (!profile) throw new NotFoundException('Tenant profile not found');
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Get('tenant/payments')
  async getTenantPayments(@Req() req): Promise<Payment[]> {
    const tenantId = req.user.id;
    return this.tenantService.getPaymentsByTenantId(tenantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tenant/maintenance')
  async getMaintenanceRequests(@Req() req): Promise<MaintenanceRequest[]> {
    const tenantId = req.user.id;
    return this.tenantService.getMaintenanceByTenantId(tenantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tenant/amenities')
  async getAmenities(@Req() req): Promise<Amenity[]> {
    const tenantId = req.user.id;
    return this.tenantService.getAmenitiesByTenantId(tenantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tenant/landlord')
  async getLandlordInfo(@Req() req): Promise<Landlord> {
    const tenantId = req.user.id;
    const landlord = await this.tenantService.getLandlordByTenantId(tenantId);
    if (!landlord) throw new NotFoundException('Landlord info not found');
    return landlord;
  }
}
