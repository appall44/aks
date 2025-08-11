import { Property } from 'src/properties/entities/property.entity';
import { Lease } from 'src/leases/lease.entity';
export declare class Unit {
    id: number;
    unitNumber: string;
    unitType: string;
    size: number;
    bedrooms: number;
    bathrooms: number;
    monthlyRent: number;
    status: string;
    description: string;
    images: string[];
    property: Property;
    leases: Lease[];
}
