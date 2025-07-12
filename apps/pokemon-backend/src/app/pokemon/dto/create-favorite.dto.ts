import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  pokemonId: number;
}
