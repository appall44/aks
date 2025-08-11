import { Tenant } from '../entities/tenant.entity';
import { Property } from '../../properties/entities/property.entity';
import { Landlord } from '../../landlord/landlord.entity';
import { User } from '../../iam/users/entities/user.entity';
import { Unit } from '../../units/entities/unit.entity';
export declare enum Priority {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
    EMERGENCY = "Emergency"
}
export declare enum Category {
    PLUMBING = "Plumbing",
    ELECTRICAL = "Electrical",
    HVAC = "HVAC",
    APPLIANCES = "Appliances",
    STRUCTURAL = "Structural",
    CLEANING = "Cleaning",
    SECURITY = "Security",
    OTHER = "Other",
    GENERAL = "general"
}
export declare class MaintenanceRequest {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'in progress' | 'pending';
    priority: Priority;
    category?: Category;
    location: string;
    images: string[];
    preferredTime: string;
    contactPhone: string;
    urgentContact?: string;
    tenant: Tenant;
    property?: Property;
    unit?: Unit;
    unitId?: number;
    landlord?: Landlord;
    assignedTo?: User;
    propertyId?: number;
    tenantId?: number;
    landlordId?: number;
    assignedToId?: number;
    createdAt: Date;
    updatedAt: Date;
}
