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
exports.OwnerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const owner_entity_1 = require("./entities/owner.entity");
const account_status_enum_1 = require("../iam/users/enums/account-status.enum");
const bcrypt = require("bcrypt");
const property_entity_1 = require("../properties/entities/property.entity");
const maintenance_entity_1 = require("../tenant/maintenance/maintenance.entity");
const lease_entity_1 = require("../leases/lease.entity");
const payment_entity_1 = require("../payments/payment.entity");
let OwnerService = class OwnerService {
    ownerRepo;
    propertyRepo;
    maintenanceRepo;
    leaseRepo;
    paymentRepo;
    constructor(ownerRepo, propertyRepo, maintenanceRepo, leaseRepo, paymentRepo) {
        this.ownerRepo = ownerRepo;
        this.propertyRepo = propertyRepo;
        this.maintenanceRepo = maintenanceRepo;
        this.leaseRepo = leaseRepo;
        this.paymentRepo = paymentRepo;
    }
    async findByEmail(email) {
        return this.ownerRepo.findOne({ where: { email } });
    }
    async createOwner(dto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const owner = this.ownerRepo.create({
            ...dto,
            password: hashedPassword,
            status: account_status_enum_1.AccountStatus.PENDING,
        });
        return this.ownerRepo.save(owner);
    }
    async updateOwner(id, data) {
        await this.ownerRepo.update(id, data);
        return this.ownerRepo.findOneBy({ id });
    }
    async deleteOwner(id) {
        return this.ownerRepo.delete(id);
    }
    async verifyOwner(id) {
        const owner = await this.findById(id);
        owner.status = account_status_enum_1.AccountStatus.APPROVED;
        owner.verified = true;
        return this.ownerRepo.save(owner);
    }
    async saveOwner(owner) {
        return this.ownerRepo.save(owner);
    }
    async findPendingOwners() {
        return this.ownerRepo.find({
            where: { status: account_status_enum_1.AccountStatus.PENDING },
        });
    }
    async updateRefreshToken(id, refreshToken) {
        const owner = await this.findById(id);
        owner.refreshToken = refreshToken;
        await this.ownerRepo.save(owner);
    }
    async findAll() {
        return this.ownerRepo.find();
    }
    async findById(id) {
        const owner = await this.ownerRepo.findOne({ where: { id } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        return owner;
    }
    async getMaintenanceNotifications(ownerId) {
        const owner = await this.ownerRepo.findOne({
            where: { id: ownerId },
            relations: ['properties'],
        });
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        const propertyIds = owner.properties.map((property) => property.id);
        const maintenanceRequests = await this.maintenanceRepo.find({
            where: {
                property: { id: (0, typeorm_2.In)(propertyIds) },
            },
            relations: ['tenant', 'property'],
            order: { createdAt: 'DESC' },
        });
        const notifications = maintenanceRequests.map((req) => ({
            id: req.id,
            title: `Maintenance Request from ${req.tenant?.firstname ?? ''} ${req.tenant?.lastname ?? ''}`,
            message: req.description,
            date: req.createdAt,
            type: 'maintenance',
            priority: req.priority,
            status: req.status === 'completed' ? 'read' : 'unread',
            property: req.property?.name ?? 'Unknown',
        }));
        return notifications;
    }
    async getRecentActivities(ownerId) {
        const properties = await this.propertyRepo.find({
            where: { owner: { id: ownerId } },
        });
        const propertyIds = properties.map((p) => p.id);
        if (propertyIds.length === 0)
            return [];
        const payments = await this.paymentRepo
            .createQueryBuilder('payment')
            .innerJoinAndSelect('payment.lease', 'lease')
            .innerJoin('lease.property', 'property')
            .where('property.id IN (:...propertyIds)', { propertyIds })
            .orderBy('payment.date', 'DESC')
            .limit(10)
            .getMany();
        const paymentActivities = payments.map((p) => ({
            id: p.id,
            type: 'Payment Received',
            message: `Payment of ${p.amount.toLocaleString()} ETB from tenant ID ${p.lease.tenantId}`,
            date: p.date.toISOString(),
            status: 'success',
            amount: `${p.amount} ETB`,
            tenantId: p.lease.tenantId,
        }));
        const maintenanceRequests = await this.maintenanceRepo.find({
            where: { property: { id: (0, typeorm_2.In)(propertyIds) } },
            relations: ['tenant', 'property'],
            order: { createdAt: 'DESC' },
            take: 10,
        });
        const maintenanceActivities = maintenanceRequests.map((req) => ({
            id: req.id,
            type: 'Maintenance Request',
            message: req.description,
            date: req.createdAt,
            priority: req.priority,
            status: req.status === 'completed' ? 'completed' : 'pending',
            tenantName: `${req.tenant?.firstname ?? ''} ${req.tenant?.lastname ?? ''}`.trim(),
            property: req.property?.name ?? 'Unknown',
        }));
        const combined = [...paymentActivities, ...maintenanceActivities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return combined.slice(0, 10);
    }
    async getPropertyPerformance(ownerId) {
        const properties = await this.propertyRepo.find({
            where: { owner: { id: ownerId } },
        });
        if (properties.length === 0)
            return [];
        const today = new Date();
        const performances = await Promise.all(properties.map(async (property) => {
            const revenueResult = await this.paymentRepo
                .createQueryBuilder('payment')
                .innerJoin('payment.lease', 'lease')
                .where('lease.propertyId = :propertyId', { propertyId: property.id })
                .select('SUM(payment.amount)', 'total')
                .getRawOne();
            const totalRevenue = Number(revenueResult.total) || 0;
            const activeLeasesCount = await this.leaseRepo.count({
                where: {
                    property: { id: property.id },
                    startDate: (0, typeorm_2.MoreThanOrEqual)(today),
                    endDate: (0, typeorm_2.MoreThanOrEqual)(today),
                },
            });
            const totalUnits = property.totalUnits || 100;
            const occupancyRate = totalUnits
                ? Math.round((activeLeasesCount / totalUnits) * 100)
                : 0;
            const trend = 'stable';
            return {
                propertyName: property.name,
                totalRevenue,
                occupancyRate,
                trend,
            };
        }));
        return performances;
    }
};
exports.OwnerService = OwnerService;
exports.OwnerService = OwnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(owner_entity_1.Owner)),
    __param(1, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(2, (0, typeorm_1.InjectRepository)(maintenance_entity_1.MaintenanceRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(lease_entity_1.Lease)),
    __param(4, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OwnerService);
//# sourceMappingURL=owner.service.js.map