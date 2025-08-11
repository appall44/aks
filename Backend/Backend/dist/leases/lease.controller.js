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
const create_lease_dto_1 = require("./dto/create-lease.dto");
const update_lease_dto_1 = require("./dto/update-lease.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let LeaseController = class LeaseController {
    leaseService;
    constructor(leaseService) {
        this.leaseService = leaseService;
    }
    async createLease(createLeaseDto, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('User not found in request');
        }
        return this.leaseService.signLease(createLeaseDto, req.user);
    }
    async signLease(propertyId, unitId, signLeaseDto, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const leaseData = {
            tenantId: req.user.id,
            propertyId,
            unitId,
            paymentMethod: signLeaseDto.paymentMethod,
            digitalSignature: signLeaseDto.digitalSignature,
        };
        console.log('Lease data to save:', leaseData);
        return this.leaseService.signLease(leaseData, req.user);
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
    async updateLease(id, updateLeaseDto) {
        return this.leaseService.updateLease(id, updateLeaseDto);
    }
    async deleteLease(id) {
        return this.leaseService.deleteLease(id);
    }
    async getLeaseByPropertyAndUnit(propertyId, unitId) {
        const lease = await this.leaseService.findLeaseByPropertyAndUnit(propertyId, unitId);
        if (!lease) {
            throw new common_1.NotFoundException(`Lease not found for property ${propertyId} and unit ${unitId}`);
        }
        return lease;
    }
};
exports.LeaseController = LeaseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lease_dto_1.SignLeaseDto, Object]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "createLease", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)('property/:propertyId/unit/:unitId/lease/sign'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('unitId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)(new common_1.ValidationPipe({ whitelist: true, transform: true }))),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, create_lease_dto_1.SignLeaseDto, Object]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "signLease", null);
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
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getLeaseById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_lease_dto_1.UpdateLeaseDto]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "updateLease", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "deleteLease", null);
__decorate([
    (0, common_1.Get)('/property/:propertyId/unit/:unitId'),
    __param(0, (0, common_1.Param)('propertyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('unitId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], LeaseController.prototype, "getLeaseByPropertyAndUnit", null);
exports.LeaseController = LeaseController = __decorate([
    (0, common_1.Controller)('leases'),
    __metadata("design:paramtypes", [lease_service_1.LeaseService])
], LeaseController);
//# sourceMappingURL=lease.controller.js.map