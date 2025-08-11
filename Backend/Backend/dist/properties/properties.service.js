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
exports.OwnerPropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./entities/property.entity");
const role_enum_1 = require("../shared/enums/role.enum");
const account_status_enum_1 = require("../iam/users/enums/account-status.enum");
const owner_entity_1 = require("../owner/entities/owner.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const tenant_entity_1 = require("../tenant/entities/tenant.entity");
let OwnerPropertiesService = class OwnerPropertiesService {
    propertyRepository;
    ownerRepository;
    adminRepository;
    tenantRepository;
    constructor(propertyRepository, ownerRepository, adminRepository, tenantRepository) {
        this.propertyRepository = propertyRepository;
        this.ownerRepository = ownerRepository;
        this.adminRepository = adminRepository;
        this.tenantRepository = tenantRepository;
    }
    async createProperty(userId, dto, userRole) {
        const user = userRole === role_enum_1.Role.OWNER
            ? await this.ownerRepository.findOne({ where: { id: userId } })
            : await this.adminRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`${userRole} not found`);
        }
        if (userRole === role_enum_1.Role.OWNER) {
            const owner = user;
            if (owner.status !== account_status_enum_1.AccountStatus.APPROVED || !owner.verified) {
                throw new common_1.ForbiddenException('Your account must be approved and verified by admin before adding properties');
            }
        }
        const propertyData = {
            name: dto.name,
            description: dto.description,
            type: dto.type,
            address: dto.address,
            city: dto.city,
            area: dto.area,
            googleMapLink: dto.googleMapLink,
            totalUnits: dto.totalUnits,
            pricePerUnit: dto.pricePerUnit,
            bedrooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            squareMeters: dto.squareMeters,
            amenities: dto.amenities,
            images: dto.images,
            featured: dto.featured,
            status: dto.status || 'active',
            payForFeatured: dto.payForFeatured,
            featuredDuration: dto.featuredDuration,
            role: userRole,
            units: [],
        };
        if (userRole === role_enum_1.Role.OWNER) {
            propertyData.owner = user;
        }
        const property = this.propertyRepository.create(propertyData);
        return this.propertyRepository.save(property);
    }
    async updateProperty(propertyId, userId, userRole, dto) {
        const property = await this.propertyRepository.findOne({
            where: { id: propertyId },
            relations: ['owner'],
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (userRole === role_enum_1.Role.OWNER && property.owner?.id !== userId) {
            throw new common_1.ForbiddenException('You do not own this property, Access Denied');
        }
        Object.assign(property, dto);
        return this.propertyRepository.save(property);
    }
    async deleteProperty(propertyId, userId, userRole) {
        const property = await this.propertyRepository.findOne({
            where: { id: propertyId },
            relations: ['owner', 'units'],
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (userRole === role_enum_1.Role.OWNER && property.owner?.id !== userId) {
            throw new common_1.ForbiddenException('You do not own this property');
        }
        await this.propertyRepository.remove(property);
    }
    async getAllProperties() {
        return this.propertyRepository.find({
            relations: ['owner', 'units'],
        });
    }
    async getPropertyById(id, userId, userRole) {
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['owner', 'units'],
        });
        if (!property) {
            console.log(`Property with ID ${id} not found`);
            throw new common_1.NotFoundException('Property not found');
        }
        console.log(`Property owner ID: ${property.owner?.id}, Request user ID: ${userId}, userRole: ${userRole}`);
        if (userRole === role_enum_1.Role.OWNER && property.owner?.id !== userId) {
            console.log('Access denied: user does not own the property');
            throw new common_1.ForbiddenException('You do not have permission to access this property');
        }
        return property;
    }
    async countPropertiesByOwner(ownerId) {
        return this.propertyRepository.count({ where: { ownerId } });
    }
    async getPropertiesByOwner(ownerId) {
        return this.propertyRepository.find({ where: { ownerId } });
    }
    async getTenantsByPropertyId(propertyId) {
        const tenants = await this.tenantRepository.find({
            where: { property: { id: propertyId } },
            relations: ['property'],
        });
        if (!tenants || tenants.length === 0) {
            throw new common_1.NotFoundException('No tenants found for this property');
        }
        return tenants;
    }
    async calculateTotalRevenue(ownerId) {
        const totalRevenue = 850000;
        return totalRevenue;
    }
    async calculateOccupancyRate(ownerId) {
        const occupancyRate = 92;
        return occupancyRate;
    }
    async getPropertiesByTenant(tenantId) {
        const tenant = await this.tenantRepository.findOne({
            where: { id: tenantId },
            relations: ['property', 'leases', 'leases.unit', 'leases.unit.property'],
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const propertiesSet = new Map();
        if (tenant.property) {
            propertiesSet.set(tenant.property.id, tenant.property);
        }
        if (tenant.leases && tenant.leases.length > 0) {
            for (const lease of tenant.leases) {
                if (lease.unit && lease.unit.property) {
                    propertiesSet.set(lease.unit.property.id, lease.unit.property);
                }
            }
        }
        const properties = Array.from(propertiesSet.values());
        if (properties.length === 0) {
            throw new common_1.NotFoundException('No properties found for this tenant');
        }
        return properties;
    }
    async countActiveTenants(ownerId) {
        const activeTenants = 45;
        return activeTenants;
    }
    async getAvailablePropertiesForTenants() {
        return this.propertyRepository.find({
            where: {
                status: 'active',
                totalUnits: (0, typeorm_2.MoreThan)(0),
            },
            relations: ['units', 'owner'],
        });
    }
    async getPropertiesWithAvailableUnits() {
        const properties = await this.propertyRepository.find({ relations: ['units'] });
        return properties.map(property => {
            const availableUnits = property.units.filter(unit => unit.status === 'vacant').length;
            return {
                ...property,
                availableUnits,
            };
        });
    }
};
exports.OwnerPropertiesService = OwnerPropertiesService;
exports.OwnerPropertiesService = OwnerPropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(2, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(3, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OwnerPropertiesService);
//# sourceMappingURL=properties.service.js.map