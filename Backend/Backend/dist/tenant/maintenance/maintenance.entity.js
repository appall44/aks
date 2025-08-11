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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRequest = exports.Category = exports.Priority = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../entities/tenant.entity");
const property_entity_1 = require("../../properties/entities/property.entity");
const landlord_entity_1 = require("../../landlord/landlord.entity");
const user_entity_1 = require("../../iam/users/entities/user.entity");
const unit_entity_1 = require("../../units/entities/unit.entity");
var Priority;
(function (Priority) {
    Priority["HIGH"] = "High";
    Priority["MEDIUM"] = "Medium";
    Priority["LOW"] = "Low";
    Priority["EMERGENCY"] = "Emergency";
})(Priority || (exports.Priority = Priority = {}));
var Category;
(function (Category) {
    Category["PLUMBING"] = "Plumbing";
    Category["ELECTRICAL"] = "Electrical";
    Category["HVAC"] = "HVAC";
    Category["APPLIANCES"] = "Appliances";
    Category["STRUCTURAL"] = "Structural";
    Category["CLEANING"] = "Cleaning";
    Category["SECURITY"] = "Security";
    Category["OTHER"] = "Other";
    Category["GENERAL"] = "general";
})(Category || (exports.Category = Category = {}));
let MaintenanceRequest = class MaintenanceRequest {
    id;
    title;
    description;
    status;
    priority;
    category;
    location;
    images;
    preferredTime;
    contactPhone;
    urgentContact;
    tenant;
    property;
    unit;
    unitId;
    landlord;
    assignedTo;
    propertyId;
    tenantId;
    landlordId;
    assignedToId;
    createdAt;
    updatedAt;
};
exports.MaintenanceRequest = MaintenanceRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Priority, default: Priority.MEDIUM }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: Category, nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], MaintenanceRequest.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "preferredTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "urgentContact", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.maintenanceRequests, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tenantId' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], MaintenanceRequest.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'propertyId' }),
    __metadata("design:type", property_entity_1.Property)
], MaintenanceRequest.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => unit_entity_1.Unit, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'unitId' }),
    __metadata("design:type", unit_entity_1.Unit)
], MaintenanceRequest.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "unitId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => landlord_entity_1.Landlord, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'landlordId' }),
    __metadata("design:type", landlord_entity_1.Landlord)
], MaintenanceRequest.prototype, "landlord", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", user_entity_1.User)
], MaintenanceRequest.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "landlordId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MaintenanceRequest.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MaintenanceRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MaintenanceRequest.prototype, "updatedAt", void 0);
exports.MaintenanceRequest = MaintenanceRequest = __decorate([
    (0, typeorm_1.Entity)()
], MaintenanceRequest);
//# sourceMappingURL=maintenance.entity.js.map