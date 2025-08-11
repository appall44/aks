import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest, Priority, Category } from './maintenance.entity';
import { CreateMaintenanceRequestDto } from './dto/maintenance-request.dto';
import { Tenant } from '../entities/tenant.entity';
import { Property } from '../../properties/entities/property.entity';
import { Landlord } from '../../landlord/landlord.entity';
import { User } from '../../iam/users/entities/user.entity';

@Injectable()
export class MaintenanceRequestService {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private readonly maintenanceRepo: Repository<MaintenanceRequest>,

    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,

    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,

    @InjectRepository(Landlord)
    private readonly landlordRepo: Repository<Landlord>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createMaintenanceRequest(dto: CreateMaintenanceRequestDto, tenant: Tenant) {
    const {
      title,
      description,
      priority,
      category,
      location,
      images,
      preferredTime,
      contactPhone,
      urgentContact,
      property,
      landlord,
      assignedToId,
    } = dto;

    // Convert priority and category strings to enum values
    const priorityEnum = Priority[priority.toUpperCase() as keyof typeof Priority];
    const categoryEnum = category ? Category[category.toUpperCase() as keyof typeof Category] : undefined;

    // Fetch property entity if property is provided as id
    let propertyEntity: Property | undefined;
    if (property) {
      if (typeof property === 'number') {
        const found = await this.propertyRepo.findOne({
          where: { id: property },
          relations: ['owner', 'owner.user'],
        });
        if (!found) throw new NotFoundException('Property not found');
        propertyEntity = found;
      } else {
        propertyEntity = property;
      }
    }

    // Fetch landlord entity if landlord is provided as id
    let landlordEntity: Landlord | undefined;
    if (landlord) {
      if (typeof landlord === 'number') {
        const found = await this.landlordRepo.findOne({
          where: { id: landlord },
          relations: ['user'],
        });
        if (!found) throw new NotFoundException('Landlord not found');
        landlordEntity = found;
      } else {
        landlordEntity = landlord;
      }
    }

    // Fetch assignedTo user by id if provided
    let assignedToEntity: User | undefined;
    if (assignedToId) {
      const found = await this.userRepo.findOneBy({ id: assignedToId });
      if (!found) throw new NotFoundException('Assigned user/admin not found');
      assignedToEntity = found;
    } else if (propertyEntity?.owner?.user) {
      assignedToEntity = propertyEntity.owner.user;
    } else if (landlordEntity?.user) {
      assignedToEntity = landlordEntity.user;
    }

    // Create the maintenance request entity
    const maintenanceRequest = this.maintenanceRepo.create({
      tenant,
      property: propertyEntity,
      landlord: landlordEntity,
      title,
      description,
      priority: priorityEnum,
      category: categoryEnum,
      location,
      images,
      preferredTime,
      contactPhone,
      urgentContact,
      status: 'pending',
      assignedTo: assignedToEntity,
    });

    // Save and return
    return this.maintenanceRepo.save(maintenanceRequest);
  }

  // Fetch maintenance requests by tenant using tenant.id filtering
  async findByTenant(tenant: Tenant): Promise<MaintenanceRequest[]> {
    return this.maintenanceRepo.find({
      where: { tenant: { id: tenant.id } },  // <-- Fix here
      relations: ['property', 'landlord', 'assignedTo'],
      order: { createdAt: 'DESC' },
    });
  }
}
