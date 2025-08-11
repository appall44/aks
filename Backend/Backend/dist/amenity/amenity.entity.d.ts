import { Property } from '../properties/entities/property.entity';
export declare class Amenity {
    id: number;
    name: string;
    description: string;
    propertyId: number;
    property: Property;
}
