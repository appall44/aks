import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import { CreateLandlordDto } from './dto/create-landlord.dto';

@Injectable()
export class LandlordService {
  constructor(
    @InjectRepository(Landlord)
    private readonly landlordRepository: Repository<Landlord>,
  ) {}

  async create(createLandlordDto: CreateLandlordDto): Promise<Landlord> {
    const landlord = this.landlordRepository.create(createLandlordDto);
    return this.landlordRepository.save(landlord);
  }

  async findAll(): Promise<Landlord[]> {
    return this.landlordRepository.find();
  }

  async findOne(id: number): Promise<Landlord | null> {
  return this.landlordRepository.findOneBy({ id });
}

}
