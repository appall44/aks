import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';

import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Role } from 'src/shared/enums/role.enum';
import { AccountStatus } from 'src/iam/users/enums/account-status.enum';
import { Owner } from 'src/owner/entities/owner.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Tenant } from '../tenant/entities/tenant.entity';

@Injectable()
export class OwnerPropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async createProperty(
    userId: number,
    dto: CreatePropertyDto,
    userRole: Role,
  ): Promise<Property> {
    const user =
      userRole === Role.OWNER
        ? await this.ownerRepository.findOne({ where: { id: userId } })
        : await this.adminRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`${userRole} not found`);
    }

    if (userRole === Role.OWNER) {
      const owner = user as Owner;
      if (owner.status !== AccountStatus.APPROVED || !owner.verified) {
        throw new ForbiddenException(
          'Your account must be approved and verified by admin before adding properties',
        );
      }
    }

    const propertyData: Partial<Property> = {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      address: dto.address,
      city: dto.city,
      area: dto.area,
      googleMapLink: dto.googleMapLink,
      totalUnits: dto.totalUnits,
      pricePerUnit: dto.pricePerUnit,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      squareMeters: dto.squareMeters,
      amenities: dto.amenities,
      images: dto.images,
      featured: dto.featured,
      status: dto.status || 'active',
      payForFeatured: dto.payForFeatured,
      featuredDuration: dto.featuredDuration,
      role: userRole,
      units: [],
    };

    if (userRole === Role.OWNER) {
      propertyData.owner = user as Owner;
    }

    const property = this.propertyRepository.create(propertyData);
    return this.propertyRepository.save(property);
  }

  async updateProperty(
    propertyId: number,
    userId: number,
    userRole: Role,
    dto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['owner'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (userRole === Role.OWNER && property.owner?.id !== userId) {
      throw new ForbiddenException('You do not own this property, Access Denied');
    }

    Object.assign(property, dto);

    return this.propertyRepository.save(property);
  }

  async deleteProperty(
    propertyId: number,
    userId: number,
    userRole: Role,
  ): Promise<void> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['owner', 'units'],
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (userRole === Role.OWNER && property.owner?.id !== userId) {
      throw new ForbiddenException('You do not own this property');
    }

    await this.propertyRepository.remove(property);
  }

  async getAllProperties(): Promise<Property[]> {
    return this.propertyRepository.find({
      relations: ['owner', 'units'],
    });
  }

async getPropertyById(
  id: number,
  userId: number,
  userRole: Role,
): Promise<Property> {
  const property = await this.propertyRepository.findOne({
    where: { id },
    relations: ['owner', 'units'],
  });

  if (!property) {
    console.log(`Property with ID ${id} not found`);
    throw new NotFoundException('Property not found');
  }

  console.log(`Property owner ID: ${property.owner?.id}, Request user ID: ${userId}, userRole: ${userRole}`);

  if (userRole === Role.OWNER && property.owner?.id !== userId) {
    console.log('Access denied: user does not own the property');
    throw new ForbiddenException('You do not have permission to access this property');
  }

  return property;
}

 async countPropertiesByOwner(ownerId: number): Promise<number> {
    return this.propertyRepository.count({ where: { ownerId } });
  }

  // Add this method:
  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return this.propertyRepository.find({ where: { ownerId } });
  }

  async getTenantsByPropertyId(propertyId: number): Promise<Tenant[]> {
    const tenants = await this.tenantRepository.find({
      where: { property: { id: propertyId } },
      relations: ['property'],
    });

    if (!tenants || tenants.length === 0) {
      throw new NotFoundException('No tenants found for this property');
    }

    return tenants;
  }

  async calculateTotalRevenue(ownerId: number): Promise<number> {
    // You can add real calculation here
    const totalRevenue = 850000;
    return totalRevenue;
  }

  async calculateOccupancyRate(ownerId: number): Promise<number> {
    // You can add real calculation here
    const occupancyRate = 92;
    return occupancyRate;
  }

  // === Corrected getPropertiesByTenant ===
  async getPropertiesByTenant(tenantId: number): Promise<Property[]> {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
      relations: ['property', 'leases', 'leases.unit', 'leases.unit.property'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const propertiesSet = new Map<number, Property>();

    if (tenant.property) {
      propertiesSet.set(tenant.property.id, tenant.property);
    }

    if (tenant.leases && tenant.leases.length > 0) {
      for (const lease of tenant.leases) {
        if (lease.unit && lease.unit.property) {
          propertiesSet.set(lease.unit.property.id, lease.unit.property);
        }
      }
    }

    const properties = Array.from(propertiesSet.values());

    if (properties.length === 0) {
      throw new NotFoundException('No properties found for this tenant');
    }

    return properties;
  }

  async countActiveTenants(ownerId: number): Promise<number> {
    const activeTenants = 45;
    return activeTenants;
  }

  async getAvailablePropertiesForTenants(): Promise<Property[]> {
    return this.propertyRepository.find({
      where: {
        status: 'active',
        totalUnits: MoreThan(0),
      },
      relations: ['units', 'owner'],
    });
  }

  async getPropertiesWithAvailableUnits() {
    const properties = await this.propertyRepository.find({ relations: ['units'] });

    return properties.map(property => {
      const availableUnits = property.units.filter(unit => unit.status === 'vacant').length;
      return {
        ...property,
        availableUnits,
      };
    });
  }
}
