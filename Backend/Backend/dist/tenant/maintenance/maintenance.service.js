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
exports.MaintenanceRequestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const maintenance_entity_1 = require("./maintenance.entity");
const tenant_entity_1 = require("../entities/tenant.entity");
const property_entity_1 = require("../../properties/entities/property.entity");
const landlord_entity_1 = require("../../landlord/landlord.entity");
const user_entity_1 = require("../../iam/users/entities/user.entity");
let MaintenanceRequestService = class MaintenanceRequestService {
    maintenanceRepo;
    tenantRepo;
    propertyRepo;
    landlordRepo;
    userRepo;
    constructor(maintenanceRepo, tenantRepo, propertyRepo, landlordRepo, userRepo) {
        this.maintenanceRepo = maintenanceRepo;
        this.tenantRepo = tenantRepo;
        this.propertyRepo = propertyRepo;
        this.landlordRepo = landlordRepo;
        this.userRepo = userRepo;
    }
    async createMaintenanceRequest(dto, tenant) {
        const { title, description, priority, category, location, images, preferredTime, contactPhone, urgentContact, property, landlord, assignedToId, } = dto;
        const priorityEnum = maintenance_entity_1.Priority[priority.toUpperCase()];
        const categoryEnum = category ? maintenance_entity_1.Category[category.toUpperCase()] : undefined;
        let propertyEntity;
        if (property) {
            if (typeof property === 'number') {
                const found = await this.propertyRepo.findOne({
                    where: { id: property },
                    relations: ['owner', 'owner.user'],
                });
                if (!found)
                    throw new common_1.NotFoundException('Property not found');
                propertyEntity = found;
            }
            else {
                propertyEntity = property;
            }
        }
        let landlordEntity;
        if (landlord) {
            if (typeof landlord === 'number') {
                const found = await this.landlordRepo.findOne({
                    where: { id: landlord },
                    relations: ['user'],
                });
                if (!found)
                    throw new common_1.NotFoundException('Landlord not found');
                landlordEntity = found;
            }
            else {
                landlordEntity = landlord;
            }
        }
        let assignedToEntity;
        if (assignedToId) {
            const found = await this.userRepo.findOneBy({ id: assignedToId });
            if (!found)
                throw new common_1.NotFoundException('Assigned user/admin not found');
            assignedToEntity = found;
        }
        else if (propertyEntity?.owner?.user) {
            assignedToEntity = propertyEntity.owner.user;
        }
        else if (landlordEntity?.user) {
            assignedToEntity = landlordEntity.user;
        }
        const maintenanceRequest = this.maintenanceRepo.create({
            tenant,
            property: propertyEntity,
            landlord: landlordEntity,
            title,
            description,
            priority: priorityEnum,
            category: categoryEnum,
            location,
            images,
            preferredTime,
            contactPhone,
            urgentContact,
            status: 'pending',
            assignedTo: assignedToEntity,
        });
        return this.maintenanceRepo.save(maintenanceRequest);
    }
    async findByTenant(tenant) {
        return this.maintenanceRepo.find({
            where: { tenant: { id: tenant.id } },
            relations: ['property', 'landlord', 'assignedTo'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.MaintenanceRequestService = MaintenanceRequestService;
exports.MaintenanceRequestService = MaintenanceRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(maintenance_entity_1.MaintenanceRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(3, (0, typeorm_1.InjectRepository)(landlord_entity_1.Landlord)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MaintenanceRequestService);
//# sourceMappingURL=maintenance.service.js.map