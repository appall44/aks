import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) {}

  async createUnit(propertyId: number, dto: CreateUnitDto): Promise<Unit> {
    const unit = this.unitRepo.create({
      ...dto,
      property: { id: propertyId },
    });
    return await this.unitRepo.save(unit); 
  }

  async getUnitsByProperty(propertyId: number): Promise<Unit[]> {
    return this.unitRepo.find({
      where: {
        property: { id: propertyId },
      },
      relations: ['property'], 
    });
  }

  async getUnitById(id: number): Promise<Unit> {
    const unit = await this.unitRepo.findOne({
      where: { id },
      relations: ['property'],
    });

    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async updateUnit(id: number, dto: UpdateUnitDto): Promise<Unit> {
    await this.unitRepo.update(id, dto);
    return this.getUnitById(id);
  }

  async deleteUnit(id: number): Promise<void> {
    await this.unitRepo.delete(id);
  }
}
