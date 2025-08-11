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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("../properties/entities/property.entity");
const payment_entity_1 = require("../payments/payment.entity");
const lease_entity_1 = require("../leases/lease.entity");
const tenant_entity_1 = require("../tenant/entities/tenant.entity");
let DashboardService = class DashboardService {
    propertyRepository;
    paymentRepository;
    leaseRepository;
    tenantRepository;
    constructor(propertyRepository, paymentRepository, leaseRepository, tenantRepository) {
        this.propertyRepository = propertyRepository;
        this.paymentRepository = paymentRepository;
        this.leaseRepository = leaseRepository;
        this.tenantRepository = tenantRepository;
    }
    async getOwnerDashboardStats(ownerId) {
        const totalProperties = await this.propertyRepository.count({
            where: { ownerId },
        });
        const revenueResult = await this.paymentRepository
            .createQueryBuilder('payment')
            .innerJoin('payment.property', 'property')
            .where('property.ownerId = :ownerId', { ownerId })
            .select('SUM(payment.amount)', 'total')
            .getRawOne();
        const totalRevenue = Number(revenueResult?.total) || 0;
        const unitsResult = await this.propertyRepository
            .createQueryBuilder('property')
            .where('property.ownerId = :ownerId', { ownerId })
            .select('SUM(property.totalUnits)', 'totalUnits')
            .getRawOne();
        const totalUnits = Number(unitsResult?.totalUnits) || 0;
        const leasedUnitsResult = await this.leaseRepository
            .createQueryBuilder('lease')
            .innerJoin('lease.property', 'property')
            .where('property.ownerId = :ownerId', { ownerId })
            .andWhere('lease.isActive = true')
            .select('COUNT(lease.id)', 'leasedUnits')
            .getRawOne();
        const leasedUnits = Number(leasedUnitsResult?.leasedUnits) || 0;
        const occupancyRate = totalUnits === 0 ? 0 : (leasedUnits / totalUnits) * 100;
        const activeTenants = await this.tenantRepository
            .createQueryBuilder('tenant')
            .innerJoin('tenant.property', 'property')
            .where('property.ownerId = :ownerId', { ownerId })
            .andWhere('tenant.isActive = true')
            .getCount();
        return {
            totalProperties,
            totalRevenue,
            occupancyRate: Math.round(occupancyRate),
            activeTenants,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(2, (0, typeorm_1.InjectRepository)(lease_entity_1.Lease)),
    __param(3, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map