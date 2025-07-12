import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PokemonFilterDto } from './dto/pokemon-filter.dto';
import { PokemonService } from './pokemon.service';
@UseGuards(JwtAuthGuard)
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  /**
   * @route GET /pokemon
   * @desc Get all pokemons
   */
  @Get()
  getAll(@Query() query: PokemonFilterDto) {
    return this.service.findAll(query);
  }

  /**
   * @route GET /pokemon/types
   * @desc Get all types
   */
  @Get('/types')
  getTypes() {
    return this.service.getTypes();
  }

  /**
   * @route GET /pokemon/favorites
   * @desc Get all favorites
   */
  @Get('/favorites')
  getFavorites(@Request() req) {
    const userId = req.user.userId;
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getFavorites(userId);
  }

  /**
   * @route POST /pokemon/favorites
   * @desc Add a favorite
   */
  @Post('/favorites')
  addFavorite(@Body() dto: CreateFavoriteDto) {
    return this.service.addFavorite(dto);
  }

  /**
   * @route DELETE /pokemon/favorites
   * @desc Remove a favorite
   */
  @Delete('/favorites')
  removeFavorite(@Body() dto: CreateFavoriteDto) {
    return this.service.removeFavorite(dto);
  }

  /**
   * @route POST /pokemon/import
   * @desc Import a CSV file
   */
  @Post('/import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // thư mục lưu file
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    })
  )
  import(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Missing file');
    return this.service.importCSV(file);
  }

  /**
   * @route GET /pokemon/:id
   * @desc Get a pokemon by id
   */
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
