// dto/pokemon-filter.dto.ts
import {
  IsOptional,
  IsString,
  IsBooleanString,
  IsNumberString,
} from 'class-validator';

export class PokemonFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBooleanString()
  isLegendary?: string;

  @IsOptional()
  @IsNumberString()
  minSpeed?: string;

  @IsOptional()
  @IsNumberString()
  maxSpeed?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
