"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const maintenance_entity_1 = require("./maintenance.entity");
const maintenance_service_1 = require("./maintenance.service");
const maintenance_controller_1 = require("./maintenance.controller");
const tenant_entity_1 = require("../entities/tenant.entity");
const property_entity_1 = require("../../properties/entities/property.entity");
const landlord_entity_1 = require("../../landlord/landlord.entity");
const user_entity_1 = require("../../iam/users/entities/user.entity");
const tenant_module_1 = require("../tenant.module");
let MaintenanceModule = class MaintenanceModule {
};
exports.MaintenanceModule = MaintenanceModule;
exports.MaintenanceModule = MaintenanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                maintenance_entity_1.MaintenanceRequest,
                property_entity_1.Property,
                landlord_entity_1.Landlord,
                tenant_entity_1.Tenant,
                user_entity_1.User,
            ]),
            tenant_module_1.TenantModule,
        ],
        providers: [maintenance_service_1.MaintenanceRequestService],
        controllers: [maintenance_controller_1.MaintenanceRequestController],
    })
], MaintenanceModule);
//# sourceMappingURL=maintenance.module.js.map