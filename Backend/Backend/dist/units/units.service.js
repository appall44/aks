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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const unit_entity_1 = require("./entities/unit.entity");
let UnitsService = class UnitsService {
    unitRepo;
    unitRepository;
    constructor(unitRepo, unitRepository) {
        this.unitRepo = unitRepo;
        this.unitRepository = unitRepository;
    }
    async createUnit(propertyId, dto) {
        const unit = this.unitRepo.create({
            ...dto,
            property: { id: propertyId },
        });
        return await this.unitRepo.save(unit);
    }
    async getUnitsByProperty(propertyId) {
        return this.unitRepo.find({
            where: {
                property: { id: propertyId },
            },
            relations: ['property'],
        });
    }
    async getUnitById(id) {
        const unit = await this.unitRepo.findOne({
            where: { id },
            relations: ['property'],
        });
        if (!unit)
            throw new common_1.NotFoundException('Unit not found');
        return unit;
    }
    async updateUnit(id, dto) {
        await this.unitRepo.update(id, dto);
        return this.getUnitById(id);
    }
    async deleteUnit(id) {
        await this.unitRepo.delete(id);
    }
    async findById(id) {
        return this.unitRepository.findOne({ where: { id } });
    }
    async updateUnitStatus(id, status) {
        const unit = await this.unitRepository.findOne({ where: { id } });
        if (!unit) {
            throw new common_1.NotFoundException(`Unit with id ${id} not found`);
        }
        unit.status = status;
        return this.unitRepository.save(unit);
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __param(1, (0, typeorm_1.InjectRepository)(unit_entity_1.Unit)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UnitsService);
//# sourceMappingURL=units.service.js.map