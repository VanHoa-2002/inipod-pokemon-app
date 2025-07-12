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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PokemonFilterDto } from './dto/pokemon-filter.dto';
import { PokemonService } from './pokemon.service';
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get()
  getAll(@Query() query: PokemonFilterDto) {
    return this.service.findAll(query);
  }

  @Get('/types')
  getTypes() {
    return this.service.getTypes();
  }

  @Get('/favorites')
  getFavorites(@Query('userId') userId: string) {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.service.getFavorites(userId);
  }

  @Post('/favorites')
  addFavorite(@Body() dto: CreateFavoriteDto) {
    return this.service.addFavorite(dto);
  }

  @Delete('/favorites')
  removeFavorite(@Body() dto: CreateFavoriteDto) {
    return this.service.removeFavorite(dto);
  }

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

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
