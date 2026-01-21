import { IsOptional , IsString,IsDateString} from "class-validator";

export class FilterEventDto {
    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsDateString()
    date?: string;

}