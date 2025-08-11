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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const tenant_entity_1 = require("../tenant/entities/tenant.entity");
const lease_entity_1 = require("../leases/lease.entity");
let PaymentsService = class PaymentsService {
    paymentRepository;
    tenantRepository;
    leaseRepository;
    constructor(paymentRepository, tenantRepository, leaseRepository) {
        this.paymentRepository = paymentRepository;
        this.tenantRepository = tenantRepository;
        this.leaseRepository = leaseRepository;
    }
    async createPayment(dto) {
        const tenantId = Number(dto.tenantId);
        if (isNaN(tenantId))
            throw new common_1.BadRequestException('Invalid tenant ID');
        const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const payment = this.paymentRepository.create({
            tenant,
            amount: dto.amount,
            paymentMethod: dto.paymentMethod,
            status: dto.status || 'unpaid',
            referenceNumber: dto.referenceNumber,
            notes: dto.notes,
            dueDate: dto.dueDate,
            paidDate: dto.paidDate,
            month: dto.month,
            date: dto.date,
        });
        return this.paymentRepository.save(payment);
    }
    async deletePayment(id) {
        const payment = await this.paymentRepository.findOne({ where: { id } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        await this.paymentRepository.remove(payment);
    }
    async getPaymentById(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['tenant', 'lease'],
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async getPaymentsByTenant(tenantId) {
        const id = Number(tenantId);
        if (isNaN(id))
            throw new common_1.BadRequestException('Invalid tenant ID');
        return this.paymentRepository.find({
            where: { tenant: { id } },
            relations: ['tenant', 'lease'],
        });
    }
    async getPaymentsByLease(leaseId) {
        const id = Number(leaseId);
        if (isNaN(id))
            throw new common_1.BadRequestException('Invalid lease ID');
        return this.paymentRepository.find({
            where: { lease: { id } },
            relations: ['tenant', 'lease'],
        });
    }
    async getAllPayments() {
        return this.paymentRepository.find({ relations: ['tenant', 'lease'] });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __param(2, (0, typeorm_1.InjectRepository)(lease_entity_1.Lease)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map