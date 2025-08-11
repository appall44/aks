import { LandlordService } from './landlord.service';
import { CreateLandlordDto } from './dto/create-landlord.dto';
export declare class LandlordController {
    private readonly landlordService;
    constructor(landlordService: LandlordService);
    create(createLandlordDto: CreateLandlordDto): Promise<import("./landlord.entity").Landlord>;
}
