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
exports.LeaseController = void 0;
const common_1 = require("@nestjs/common");
const lease_service_1 = require("./lease.service");
const sign_lease_dto_1 = require("./dto/sign-lease.dto");
const create_lease_dto_1 = require("./dto/create-lease.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const units_service_1 = require("../units/units.service");
let LeaseController = class LeaseController {
    leaseService;
    unitService;
    constructor(leaseService, unitService) {
        this.leaseService = leaseService;
        this.unitService = unitService;
    }
    async reqLease(propertyId, unitId, CreateLeaseDto, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const leaseData = {
            tenantId: req.user.id,
            propertyId,
            unitId,
            digitalSignature: CreateLeaseDto.digitalSignature,
            startDate: CreateLeaseDto.startDate,
            endDate: CreateLeaseDto.endDate,
            rentAmount: CreateLeaseDto.rentAmount,
            status: CreateLeaseDto.status ?? 'pending',
        };
        console.log('Lease data to save:', leaseData);
        return this.leaseService.createLease(leaseData, req.user);
    }
    async signLease(propertyId, unitId, signLeaseDto, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException();
        }
        const lease = await this.leaseService.findByPropertyAndUnit(propertyId, unitId);
        if (!lease) {
            throw new common_1.NotFoundException('Lease not found');
        }
        const unit = await this.unitService.findById(unitId);
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        if (unit.status === 'occupied') {
            throw new common_1.BadRequestException('Unit is already occupied');
        }
        if (signLeaseDto.paymentMethod !== undefined) {
            lease.paymentMethod = signLeaseDto.paymentMethod;
        }
        if (signLeaseDto.digitalSignature !== undefined) {
            lease.digitalSignature = signLeaseDto.digitalSignature;
        }
        lease.status = 'active';
        await this.leaseService.updateLease(lease.id, {
            paymentMethod: lease.paymentMethod,
            digitalSignature: lease.digitalSignature,
            status: lease.status,
        });
        await this.unitService.updateUnitStatus(unitId, 'occupied');
        return {
            message: 'Lease signed successfully. Unit marked as occupied.',
            leaseId: lease.id,
            unitId: unitId,
            unitStatus: 'occupied',
        };
    }
    async getLeaseByPropertyAndUnit(propertyId, unitId, req) {
        return this.leaseService.findByPropertyAndUnit(propertyId, unitId);
    }
    async getAllLeases() {
        return this.leaseService.findAllLeases();
    }
    async getLeasesByTenant(tenantId) {
        return this.leaseService.findLeasesByTenant(tenantId);
    }
    async getLeasesByOwner(ownerId) {
        return this.leaseService.findLeasesByOwner(ownerId);
    }
    async getLeaseById(id) {
        const lease = await this.leaseService.findLeaseById(id);
        if (!lease) {
            throw new common_1.NotFoundException(`Lease with id ${id} not found`);
        }
        return lease;
    }
    async deleteLease(id) {
        return this.leaseService.deleteLease(id);
    }
};
exports.LeaseController = LeaseController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('properties/:propertyId/units/:unitId/rental'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('unitId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, transform: true }))),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, create_lease_dto_1.CreateLeaseDto, Object]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "reqLease", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('properties/:propertyId/units/:unitId/lease/sign'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('unitId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, transform: true }))),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, sign_lease_dto_1.SignLeaseDto, Object]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "signLease", null);
__decorate([
    (0, common_1.Get)('properties/:propertyId/units/:unitId/lease'),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('unitId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getLeaseByPropertyAndUnit", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getAllLeases", null);
__decorate([
    (0, common_1.Get)('/tenant/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getLeasesByTenant", null);
__decorate([
    (0, common_1.Get)('/owner/:ownerId'),
    __param(0, (0, common_1.Param)('ownerId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getLeasesByOwner", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getLeaseById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "deleteLease", null);
exports.LeaseController = LeaseController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [lease_service_1.LeaseService,
        units_service_1.UnitsService])
], LeaseController);
//# sourceMappingURL=lease.controller.js.map