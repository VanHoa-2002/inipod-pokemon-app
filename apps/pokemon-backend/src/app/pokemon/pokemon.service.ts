import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PokemonFilterDto } from './dto/pokemon-filter.dto';
import { Favorite } from './entities/favorite.entity';
import { Pokemon } from './entities/pokemon.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepo: Repository<Pokemon>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>
  ) {}

  async findAll(query: PokemonFilterDto) {
    const {
      name,
      type,
      isLegendary,
      minSpeed,
      maxSpeed,
      page = '1',
      limit = '20',
    } = query;

    const qb = this.pokemonRepo.createQueryBuilder('pokemon');

    if (name) qb.andWhere('pokemon.name ILIKE :name', { name: `%${name}%` });
    if (type)
      qb.andWhere('(pokemon.type1 = :type OR pokemon.type2 = :type)', { type });
    if (isLegendary === 'true') {
      qb.andWhere('pokemon.isLegendary = true');
    }
    if (minSpeed)
      qb.andWhere('pokemon.speed >= :minSpeed', { minSpeed: +minSpeed });
    if (maxSpeed)
      qb.andWhere('pokemon.speed <= :maxSpeed', { maxSpeed: +maxSpeed });

    const total = await qb.getCount();
    const data = await qb
      .offset((+page - 1) * +limit)
      .limit(+limit)
      .getMany();

    return { total, page: +page, limit: +limit, data };
  }

  findById(id: number) {
    return this.pokemonRepo.findOne({ where: { id } });
  }

  async getTypes(): Promise<string[]> {
    const type1 = await this.pokemonRepo
      .createQueryBuilder()
      .select('DISTINCT type1')
      .getRawMany();

    const type2 = await this.pokemonRepo
      .createQueryBuilder()
      .select('DISTINCT type2')
      .getRawMany();

    const type1List = Array.isArray(type1) ? type1.map((t) => t.type1) : [];
    const type2List = Array.isArray(type2) ? type2.map((t) => t.type2) : [];

    const all = [...type1List, ...type2List].filter(Boolean);
    return Array.from(new Set(all)).sort();
  }

  async getFavorites(userId: string) {
    const favs = await this.favoriteRepo.find({
      where: { userId },
      relations: ['pokemon'],
    });
    return favs.map((f) => f.pokemon);
  }

  async addFavorite(dto: CreateFavoriteDto) {
    const exists = await this.favoriteRepo.findOneBy({
      userId: dto.userId,
      pokemonId: dto.pokemonId,
    });

    if (exists) {
      return { message: 'Already favorited' };
    }

    await this.favoriteRepo.save(dto);
    return { message: 'Added to favorites' };
  }

  async removeFavorite(dto: CreateFavoriteDto) {
    await this.favoriteRepo.delete({
      userId: dto.userId,
      pokemonId: dto.pokemonId,
    });
    return { message: 'Removed from favorites' };
  }

  async importCSV(file: Express.Multer.File) {
    const csv = await import('csv-parser');
    const fs = await import('fs');
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv.default())
        .on('data', (data) => {
          const key = Object.keys(data).find((k) =>
            k.toLowerCase().includes('id')
          );
          const cleanedId = key ? data[key]?.trim() : undefined;
          const parsedId = Number(cleanedId);
          if (!parsedId || isNaN(parsedId)) return; // skip invalid row

          results.push({
            id: parsedId,
            name: data.name,
            type1: data.type1,
            type2: data.type2?.trim() || null,
            total: Number(data.total),
            hp: Number(data.hp),
            attack: Number(data.attack),
            defense: Number(data.defense),
            spAtk: Number(data.spAttack),
            spDef: Number(data.spDefense),
            speed: Number(data.speed),
            generation: Number(data.generation),
            isLegendary: data.legendary?.toLowerCase().trim() === 'true',
            image: data.image,
            ytbUrl: data.ytbUrl,
          });
        })
        .on('end', async () => {
          try {
            const validResults = results.filter(
              (r) => typeof r.id === 'number' && !isNaN(r.id)
            );
            const existIds = await this.pokemonRepo.find({
              where: { id: In(validResults.map((r) => r.id)) },
            });
            const existIdSet = new Set(existIds.map((e) => e.id));
            const insertList = validResults.filter(
              (r) => !existIdSet.has(r.id)
            );

            if (insertList.length > 0) {
              const batchSize = 500;
              for (let i = 0; i < insertList.length; i += batchSize) {
                const chunk = insertList.slice(i, i + batchSize);
                await this.pokemonRepo.insert(chunk);
              }
            }

            fs.unlinkSync(file.path);
            resolve({
              message: `Imported ${insertList.length} Pokémon(s)`,
              skipped: existIds.length,
              hasChanged: insertList.length > 0,
            });
          } catch (err) {
            reject(err);
          }
        });
    });
  }
}
