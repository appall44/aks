import { Property } from '../properties/entities/property.entity';
import { User } from '../iam/users/entities/user.entity';
export declare class Landlord {
    id: number;
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    properties: Property[];
    user?: User;
}
