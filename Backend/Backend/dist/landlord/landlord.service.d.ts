import { Repository } from 'typeorm';
import { Landlord } from './landlord.entity';
import { CreateLandlordDto } from './dto/create-landlord.dto';
export declare class LandlordService {
    private readonly landlordRepository;
    constructor(landlordRepository: Repository<Landlord>);
    create(createLandlordDto: CreateLandlordDto): Promise<Landlord>;
    findAll(): Promise<Landlord[]>;
    findOne(id: number): Promise<Landlord | null>;
}
