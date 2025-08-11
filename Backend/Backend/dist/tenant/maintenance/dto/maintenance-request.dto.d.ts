import { Priority, Category } from '../maintenance.entity';
import { Property } from '../../../properties/entities/property.entity';
import { Landlord } from '../../../landlord/landlord.entity';
export declare class CreateMaintenanceRequestDto {
    title: string;
    description: string;
    priority: Priority;
    category?: Category;
    location?: string;
    images?: string[];
    preferredTime?: string;
    contactPhone?: string;
    urgentContact?: string;
    property?: Property | number;
    landlord?: Landlord | number;
    assignedToId?: number;
}
