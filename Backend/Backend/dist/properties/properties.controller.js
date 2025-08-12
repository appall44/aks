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
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const tenant_service_1 = require("../tenant/tenant.service");
const properties_service_1 = require("./properties.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../shared/decorators/roles.decorator");
const role_enum_1 = require("../shared/enums/role.enum");
const update_property_dto_1 = require("./dto/update-property.dto");
let PropertiesController = class PropertiesController {
    service;
    tenantService;
    constructor(service, tenantService) {
        this.service = service;
        this.tenantService = tenantService;
    }
    async getAvailableProperties() {
        return this.service.getAvailablePropertiesForTenants();
    }
    async createProperty(images, body, req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        try {
            const dto = {
                name: String(body.name),
                description: String(body.description),
                type: String(body.type),
                address: String(body.address),
                city: String(body.city),
                area: String(body.area),
                totalUnits: parseInt(body.totalUnits, 10),
                pricePerUnit: parseFloat(body.pricePerUnit),
                bedrooms: parseInt(body.bedrooms, 10),
                bathrooms: parseInt(body.bathrooms, 10),
                squareMeters: body.squareMeters ? Number(body.squareMeters) : undefined,
                googleMapLink: body.googleMapLink ? String(body.googleMapLink) : undefined,
                featured: body.featured === 'true',
                status: String(body.status),
                payForFeatured: body.payForFeatured === 'true',
                featuredDuration: String(body.featuredDuration),
                amenities: Array.isArray(body.amenities)
                    ? body.amenities
                    : body.amenities
                        ? [body.amenities]
                        : [],
                images: images.map((file) => file.filename),
            };
            const property = await this.service.createProperty(userId, dto, userRole);
            return { message: 'Property created successfully', property };
        }
        catch (error) {
            console.error('Error in createProperty:', error);
            throw new common_1.HttpException('Invalid data format', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getDashboardData(req) {
        const ownerId = req.user.id;
        return {
            totalProperties: await this.service.countPropertiesByOwner(ownerId),
            totalRevenue: await this.service.calculateTotalRevenue(ownerId),
            occupancyRate: await this.service.calculateOccupancyRate(ownerId),
            activeTenants: await this.service.countActiveTenants(ownerId),
        };
    }
    async getPropertyById(id, req) {
        console.log('req.user:', req.user);
        if (!req.user) {
            throw new common_1.HttpException('Unauthorized access: user not found in request', common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = req.user.id;
        const userRole = req.user.role;
        const property = await this.service.getPropertyById(+id, userId, userRole);
        if (!property) {
            throw new common_1.HttpException('Property not found', common_1.HttpStatus.NOT_FOUND);
        }
        return property;
    }
    async updateProperty(id, dto, req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        const updatedProperty = await this.service.updateProperty(id, userId, userRole, dto);
        return {
            message: 'Property updated successfully',
            property: updatedProperty,
        };
    }
    async deleteProperty(id, req) {
        const userId = req.user.id;
        const userRole = req.user.role;
        await this.service.deleteProperty(id, userId, userRole);
        return { message: 'Property deleted successfully' };
    }
    async getTenantsByProperty(propertyId) {
        return this.tenantService.getTenantsByPropertyId(propertyId);
    }
    async getPropertiesByOwner(ownerId) {
        return this.service.getPropertiesByOwner(ownerId);
    }
    getPropertyActivities(propertyId) {
        return `Activities for property ${propertyId}`;
    }
    async getPropertiesByTenant(tenantId) {
        return this.service.getPropertiesByTenant(tenantId);
    }
    async getPropertiesWithAvailableUnits() {
        return this.service.getPropertiesWithAvailableUnits();
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getAvailableProperties", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/properties',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "createProperty", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getPropertyById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_property_dto_1.UpdatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "updateProperty", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "deleteProperty", null);
__decorate([
    (0, common_1.Get)(':id/tenants'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getTenantsByProperty", null);
__decorate([
    (0, common_1.Get)('owner/:ownerId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getPropertiesByOwner", null);
__decorate([
    (0, common_1.Get)(':id/activities'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "getPropertyActivities", null);
__decorate([
    (0, common_1.Get)('tenant/:tenantId/my-properties'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getPropertiesByTenant", null);
__decorate([
    (0, common_1.Get)('available-units'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PropertiesController.prototype, "getPropertiesWithAvailableUnits", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.OWNER, role_enum_1.Role.ADMIN, role_enum_1.Role.TENANT),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.OwnerPropertiesService,
        tenant_service_1.TenantService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map