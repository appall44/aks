import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum'; 
import { UserRole } from '../../iam/users/enums/user-role.enum'; 

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
