import { AccountStatus } from 'src/iam/users/enums/account-status.enum';
import { Property } from 'src/properties/entities/property.entity';
import { User } from 'src/iam/users/entities/user.entity';
export declare class Owner {
    id: number;
    firstname: string;
    lastname: string;
    idNumber: string;
    phone: string;
    email: string;
    password: string;
    location: string;
    googleMapLink: string;
    agreementsAccepted: boolean;
    ownershipProofUrl?: string;
    role: string;
    verified: boolean;
    status: AccountStatus;
    refreshToken?: string;
    properties: Property[];
    user?: User;
    userId?: number;
}
