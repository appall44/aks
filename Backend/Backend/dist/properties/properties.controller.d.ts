import { Request } from 'express';
import { Tenant } from '../tenant/entities/tenant.entity';
import { TenantService } from '../tenant/tenant.service';
import { OwnerPropertiesService } from './properties.service';
import { Role } from 'src/shared/enums/role.enum';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertiesController {
    private readonly service;
    private readonly tenantService;
    constructor(service: OwnerPropertiesService, tenantService: TenantService);
    getAvailableProperties(): Promise<import("./entities/property.entity").Property[]>;
    createProperty(images: Express.Multer.File[], body: any, req: Request & {
        user: any;
    }): Promise<{
        message: string;
        property: import("./entities/property.entity").Property;
    }>;
    getDashboardData(req: Request & {
        user: any;
    }): Promise<{
        totalProperties: number;
        totalRevenue: number;
        occupancyRate: number;
        activeTenants: number;
    }>;
    getPropertyById(id: number, req: Request & {
        user?: any;
    }): Promise<import("./entities/property.entity").Property>;
    updateProperty(id: number, dto: UpdatePropertyDto, req: Request & {
        user: any;
    }): Promise<{
        message: string;
        property: import("./entities/property.entity").Property;
    }>;
    deleteProperty(id: number, req: Request & {
        user: any;
    }): Promise<{
        message: string;
    }>;
    getTenantsByProperty(propertyId: number): Promise<Tenant[]>;
    getPropertiesByOwner(ownerId: number): Promise<import("./entities/property.entity").Property[]>;
    getPropertyActivities(propertyId: number): string;
    getPropertiesByTenant(tenantId: number): Promise<import("./entities/property.entity").Property[]>;
    getPropertiesWithAvailableUnits(): Promise<{
        availableUnits: number;
        id: number;
        name: string;
        description: string;
        type: string;
        address: string;
        city: string;
        area: string;
        googleMapLink: string;
        totalUnits: number;
        pricePerUnit: number;
        bedrooms: number;
        bathrooms: number;
        squareMeters: number;
        amenities: string[];
        images: string[];
        featured: boolean;
        status: string;
        payForFeatured: boolean;
        featuredDuration: string;
        role: Role;
        ownerId: number;
        owner: import("../owner/entities/owner.entity").Owner;
        units: import("../units/entities/unit.entity").Unit[];
        tenants: Tenant[];
        landlordId?: number;
        landlord?: import("../landlord/landlord.entity").Landlord;
        amenitiesEntities: import("../amenity/amenity.entity").Amenity[];
        leases: import("../leases/lease.entity").Lease[];
    }[]>;
}
