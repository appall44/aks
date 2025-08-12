import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from './entities/tenant.entity';
import { Payment } from '../payments/payment.entity';
import { MaintenanceRequest } from './maintenance/maintenance.entity';
import { Amenity } from '../amenity/amenity.entity';
import { MailService } from '../auth/email/mail.service';
import { SignupDto } from './dto/create-tenant.dto';
import { Landlord } from '../landlord/landlord.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepo: Repository<Tenant>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(MaintenanceRequest)
    private maintenanceRepo: Repository<MaintenanceRequest>,

    @InjectRepository(Amenity)
    private amenityRepo: Repository<Amenity>,

    @InjectRepository(Landlord)
    private landlordRepo: Repository<Landlord>,

    private mailService: MailService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpExpiry(): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    return expiry;
  }

  private async sendOtpEmail(email: string, otp: string) {
    await this.mailService.sendOtpEmail(email, otp);
  }

  async findByEmail(email: string): Promise<Tenant | null> {
    return this.tenantRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({
      where: { id },
      relations: ['property', 'property.landlord'],  // load related property and landlord
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async createTenant(dto: SignupDto): Promise<Tenant> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const tenant = this.tenantRepo.create({
      email: dto.email,
      password: await this.hashPassword(dto.password),
      firstname: dto.firstname,
      lastname: dto.lastname,
      idNumber: dto.idNumber,
      phone: dto.phone,
      occupation: dto.occupation,
      otp: this.generateOtp(),
      otpExpiresAt: this.getOtpExpiry(),
      verified: false,
      role: dto.role || 'TENANT',
    });
    await this.tenantRepo.save(tenant);
    await this.sendOtpEmail(dto.email, tenant.otp!);
    return tenant;
  }

  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    const tenant = await this.findByEmail(email);
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (!tenant.otp || !tenant.otpExpiresAt)
      throw new BadRequestException('No OTP found');

    if (tenant.otp !== otp) throw new BadRequestException('Invalid OTP');
    if (tenant.otpExpiresAt < new Date()) throw new BadRequestException('OTP expired');

    tenant.verified = true;
    tenant.otp = null;
    tenant.otpExpiresAt = null;
    await this.tenantRepo.save(tenant);

    return { message: 'OTP verified. You can now log in.' };
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    const tenant = await this.findByEmail(email);
    if (!tenant) throw new NotFoundException('Tenant not found');
    if (tenant.verified) throw new BadRequestException('Already verified');

    tenant.otp = this.generateOtp();
    tenant.otpExpiresAt = this.getOtpExpiry();
    await this.tenantRepo.save(tenant);

    await this.sendOtpEmail(email, tenant.otp!);
    return { message: 'OTP resent to email.' };
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }

  async updateTenant(id: number, updateData: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.findById(id);
    Object.assign(tenant, updateData);
    return this.tenantRepo.save(tenant);
  }
  async updateRefreshToken(tenantId: number, refreshToken: string): Promise<void> {
  const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
  if (!tenant) throw new NotFoundException('Tenant not found');

  tenant.refreshToken = refreshToken;
  await this.tenantRepo.save(tenant);
}


  async deleteTenant(id: number) {
    const result = await this.tenantRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Tenant not found');
    return { message: 'Tenant deleted successfully' };
  }

  async getTenantsByPropertyId(propertyId: number): Promise<Tenant[]> {
  return this.tenantRepo.find({
    where: { property: { id: propertyId } },
    relations: ['property'],
  });
}


  async getPaymentsByTenantId(tenantId: number): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { tenant: { id: tenantId } },
      order: { date: 'DESC' },
    });
  }

 async getMaintenanceByTenantId(tenantId: number): Promise<MaintenanceRequest[]> {
  return this.maintenanceRepo.find({
    where: { tenant: { id: tenantId } },
    order: { createdAt: 'DESC' },
  });
}

async getAmenitiesByTenantId(tenantId: number): Promise<Amenity[]> {
  const tenant = await this.tenantRepo.findOne({
    where: { id: tenantId },
    relations: ['property'],
  });

  if (!tenant || !tenant.property) {
    return [];
  }

  return this.amenityRepo.find({
    where: { property: { id: tenant.property.id } },
  });
}

async getLandlordByTenantId(tenantId: number): Promise<Landlord> {
  const tenant = await this.tenantRepo.findOne({
    where: { id: tenantId },
    relations: ['property', 'property.landlord'],
  });
  console.log('Tenant:', tenant);
  console.log('Property:', tenant?.property);
  console.log('Landlord:', tenant?.property?.landlord);

  if (!tenant?.property?.landlord) {
    throw new NotFoundException('Landlord info not found');
  }

  return tenant.property.landlord;
}


  async getDashboardData(tenantId: number) {
    const [profile, payments, maintenance, amenities, landlord] =
      await Promise.all([
        this.findById(tenantId),
        this.getPaymentsByTenantId(tenantId),
        this.getMaintenanceByTenantId(tenantId),
        this.getAmenitiesByTenantId(tenantId),
        this.getLandlordByTenantId(tenantId),
      ]);

    return { profile, payments, maintenance, amenities, landlord };
  }

async getRentalInfo(tenantId: number) {
  const tenant = await this.tenantRepo.findOne({
    where: { id: Number(tenantId) },
    relations: ['leases', 'leases.unit', 'leases.unit.property'],
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found');
  }

  const activeLease = tenant.leases?.[0]; // safe access

  // If no lease found, return empty object (frontend will show "No rental information available")
  if (!activeLease || !activeLease.unit) {
    return {};
  }

  return {
    property: {
      name: activeLease.unit.property?.name || null,
    },
    unit: activeLease.unit.unitNumber || null,
    leaseStart: activeLease.startDate || null,
    leaseEnd: activeLease.endDate || null,
    monthlyRent: activeLease.unit.monthlyRent || null,
    deposit: activeLease.unit.deposit || null,
    status: activeLease.status || null,
  };
}


}
