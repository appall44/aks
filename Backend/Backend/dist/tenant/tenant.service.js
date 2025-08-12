"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const tenant_entity_1 = require("./entities/tenant.entity");
const payment_entity_1 = require("../payments/payment.entity");
const maintenance_entity_1 = require("./maintenance/maintenance.entity");
const amenity_entity_1 = require("../amenity/amenity.entity");
const mail_service_1 = require("../auth/email/mail.service");
const landlord_entity_1 = require("../landlord/landlord.entity");
let TenantService = class TenantService {
    tenantRepo;
    paymentRepo;
    maintenanceRepo;
    amenityRepo;
    landlordRepo;
    mailService;
    constructor(tenantRepo, paymentRepo, maintenanceRepo, amenityRepo, landlordRepo, mailService) {
        this.tenantRepo = tenantRepo;
        this.paymentRepo = paymentRepo;
        this.maintenanceRepo = maintenanceRepo;
        this.amenityRepo = amenityRepo;
        this.landlordRepo = landlordRepo;
        this.mailService = mailService;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    getOtpExpiry() {
        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);
        return expiry;
    }
    async sendOtpEmail(email, otp) {
        await this.mailService.sendOtpEmail(email, otp);
    }
    async findByEmail(email) {
        return this.tenantRepo.findOne({ where: { email } });
    }
    async findById(id) {
        const tenant = await this.tenantRepo.findOne({
            where: { id },
            relations: ['property', 'property.landlord'],
        });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async createTenant(dto) {
        const existing = await this.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email already in use');
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
        await this.sendOtpEmail(dto.email, tenant.otp);
        return tenant;
    }
    async verifyOtp(email, otp) {
        const tenant = await this.findByEmail(email);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        if (!tenant.otp || !tenant.otpExpiresAt)
            throw new common_1.BadRequestException('No OTP found');
        if (tenant.otp !== otp)
            throw new common_1.BadRequestException('Invalid OTP');
        if (tenant.otpExpiresAt < new Date())
            throw new common_1.BadRequestException('OTP expired');
        tenant.verified = true;
        tenant.otp = null;
        tenant.otpExpiresAt = null;
        await this.tenantRepo.save(tenant);
        return { message: 'OTP verified. You can now log in.' };
    }
    async resendOtp(email) {
        const tenant = await this.findByEmail(email);
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        if (tenant.verified)
            throw new common_1.BadRequestException('Already verified');
        tenant.otp = this.generateOtp();
        tenant.otpExpiresAt = this.getOtpExpiry();
        await this.tenantRepo.save(tenant);
        await this.sendOtpEmail(email, tenant.otp);
        return { message: 'OTP resent to email.' };
    }
    async findAll() {
        return this.tenantRepo.find();
    }
    async updateTenant(id, updateData) {
        const tenant = await this.findById(id);
        Object.assign(tenant, updateData);
        return this.tenantRepo.save(tenant);
    }
    async updateRefreshToken(tenantId, refreshToken) {
        const tenant = await this.tenantRepo.findOne({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        tenant.refreshToken = refreshToken;
        await this.tenantRepo.save(tenant);
    }
    async deleteTenant(id) {
        const result = await this.tenantRepo.delete(id);
        if (!result.affected)
            throw new common_1.NotFoundException('Tenant not found');
        return { message: 'Tenant deleted successfully' };
    }
    async getTenantsByPropertyId(propertyId) {
        return this.tenantRepo.find({
            where: { property: { id: propertyId } },
            relations: ['property'],
        });
    }
    async getPaymentsByTenantId(tenantId) {
        return this.paymentRepo.find({
            where: { tenant: { id: tenantId } },
            order: { date: 'DESC' },
        });
    }
    async getMaintenanceByTenantId(tenantId) {
        return this.maintenanceRepo.find({
            where: { tenant: { id: tenantId } },
            order: { createdAt: 'DESC' },
        });
    }
    async getAmenitiesByTenantId(tenantId) {
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
    async getLandlordByTenantId(tenantId) {
        const tenant = await this.tenantRepo.findOne({
            where: { id: tenantId },
            relations: ['property', 'property.landlord'],
        });
        console.log('Tenant:', tenant);
        console.log('Property:', tenant?.property);
        console.log('Landlord:', tenant?.property?.landlord);
        if (!tenant?.property?.landlord) {
            throw new common_1.NotFoundException('Landlord info not found');
        }
        return tenant.property.landlord;
    }
    async getDashboardData(tenantId) {
        const [profile, payments, maintenance, amenities, landlord] = await Promise.all([
            this.findById(tenantId),
            this.getPaymentsByTenantId(tenantId),
            this.getMaintenanceByTenantId(tenantId),
            this.getAmenitiesByTenantId(tenantId),
            this.getLandlordByTenantId(tenantId),
        ]);
        return { profile, payments, maintenance, amenities, landlord };
    }
    async getRentalInfo(tenantId) {
        const tenant = await this.tenantRepo.findOne({
            where: { id: Number(tenantId) },
            relations: ['leases', 'leases.unit', 'leases.unit.property'],
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const activeLease = tenant.leases?.[0];
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
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(maintenance_entity_1.MaintenanceRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(amenity_entity_1.Amenity)),
    __param(4, (0, typeorm_1.InjectRepository)(landlord_entity_1.Landlord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mail_service_1.MailService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map