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
exports.LeaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lease_entity_1 = require("./lease.entity");
const tenant_entity_1 = require("../tenant/entities/tenant.entity");
const property_entity_1 = require("../properties/entities/property.entity");
const unit_entity_1 = require("../units/entities/unit.entity");
let LeaseService = class LeaseService {
    leaseRepository;
    tenantRepository;
    propertyRepository;
    unitRepository;
    constructor(leaseRepository, tenantRepository, propertyRepository, unitRepository) {
        this.leaseRepository = leaseRepository;
        this.tenantRepository = tenantRepository;
        this.propertyRepository = propertyRepository;
        this.unitRepository = unitRepository;
    }
    async createLease(leaseData, user) {
        const tenantId = leaseData.tenantId || user.id;
        let lease = await this.leaseRepository.findOne({
            where: {
                propertyId: leaseData.propertyId,
                unitId: leaseData.unitId,
                tenantId: tenantId,
            },
        });
        if (!lease) {
            lease = new lease_entity_1.Lease();
            lease.tenantId = tenantId;
            lease.propertyId = leaseData.propertyId;
            lease.unitId = leaseData.unitId;
            if (!leaseData.startDate) {
                throw new Error('startDate is required');
            }
            if (!leaseData.endDate) {
                throw new Error('endDate is required');
            }
            lease.startDate = new Date(leaseData.startDate);
            lease.endDate = new Date(leaseData.endDate);
            lease.rentAmount = leaseData.rentAmount;
            lease.status = leaseData.status || 'active';
            if (leaseData.digitalSignature) {
                lease.digitalSignature = leaseData.digitalSignature;
            }
        }
        else {
            if (leaseData.digitalSignature !== undefined) {
                lease.digitalSignature = leaseData.digitalSignature;
            }
            if (leaseData.status !== undefined) {
                lease.status = leaseData.status;
            }
            if (leaseData.startDate) {
                lease.startDate = new Date(leaseData.startDate);
            }
            if (leaseData.endDate) {
                lease.endDate = new Date(leaseData.endDate);
            }
            if (leaseData.rentAmount !== undefined) {
                lease.rentAmount = leaseData.rentAmount;
            }
        }
        await this.leaseRepository.save(lease);
        return lease;
    }
    async findAllLeases() {
        return this.leaseRepository.find({ relations: ['tenant', 'user', 'property', 'unit'] });
    }
    async updateLease(id, updateData) {
        const lease = await this.leaseRepository.findOneBy({ id });
        if (!lease) {
            throw new common_1.NotFoundException(`Lease with id ${id} not found`);
        }
        const { id: _, ...fieldsToUpdate } = updateData;
        Object.assign(lease, fieldsToUpdate);
        return this.leaseRepository.save(lease);
    }
    async findByPropertyAndUnit(propertyId, unitId) {
        return this.leaseRepository.findOne({
            where: {
                propertyId,
                unitId,
            },
            relations: ['tenant', 'property', 'unit'],
        });
    }
    async findLeaseById(id) {
        const lease = await this.leaseRepository.findOne({
            where: { id },
            relations: ['tenant', 'user', 'property', 'unit'],
        });
        if (!lease)
            throw new common_1.NotFoundException(`Lease with ID ${id} not found`);
        return lease;
    }
    async deleteLease(id) {
        const result = await this.leaseRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException(`Lease with ID ${id} not found`);
    }
    async findLeaseByPropertyAndUnit(propertyId, unitId) {
        const lease = await this.leaseRepository.findOne({
            where: { propertyId, unitId },
            relations: ['property', 'unit', 'tenant', 'user'],
        });
        if (!lease)
            throw new common_1.NotFoundException(`Lease not found for property ${propertyId} and unit ${unitId}`);
        return lease;
    }
    async findLeasesByOwner(ownerId) {
        return this.leaseRepository.find({
            where: { property: { owner: { id: ownerId } } },
            relations: ['tenant', 'property', 'unit', 'user'],
        });
    }
    async findLeasesByTenant(tenantId) {
        return this.leaseRepository.find({
            where: { tenantId },
            relations: ['tenant', 'property', 'unit', 'user'],
        });
    }
};
exports.LeaseService = LeaseService;
exports.LeaseService = LeaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lease_entity_1.Lease)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(3, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LeaseService);
//# sourceMappingURL=lease.service.js.map