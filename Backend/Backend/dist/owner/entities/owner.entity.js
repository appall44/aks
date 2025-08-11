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
exports.Owner = void 0;
const typeorm_1 = require("typeorm");
const account_status_enum_1 = require("../../iam/users/enums/account-status.enum");
const property_entity_1 = require("../../properties/entities/property.entity");
const user_entity_1 = require("../../iam/users/entities/user.entity");
let Owner = class Owner {
    id;
    firstname;
    lastname;
    idNumber;
    phone;
    email;
    password;
    location;
    googleMapLink;
    agreementsAccepted;
    ownershipProofUrl;
    role;
    verified;
    status;
    refreshToken;
    properties;
    user;
    userId;
};
exports.Owner = Owner;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Owner.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "idNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Owner.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Owner.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "googleMapLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Owner.prototype, "agreementsAccepted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "ownershipProofUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'owner' }),
    __metadata("design:type", String)
], Owner.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Owner.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: account_status_enum_1.AccountStatus,
        default: account_status_enum_1.AccountStatus.PENDING,
    }),
    __metadata("design:type", String)
], Owner.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_entity_1.Property, (property) => property.owner),
    __metadata("design:type", Array)
], Owner.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Owner.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Owner.prototype, "userId", void 0);
exports.Owner = Owner = __decorate([
    (0, typeorm_1.Entity)('owners')
], Owner);
//# sourceMappingURL=owner.entity.js.map