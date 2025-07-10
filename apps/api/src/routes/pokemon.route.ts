import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { PokemonModel } from '../models/pokemon.model';
import { FavoriteModel } from '../models/favorite.model';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

/**
 * @route POST /api/pokemon/import
 * @desc Import Pokemon data from CSV
 */
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file is required.' });
  }

  const results: any[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      const key = Object.keys(data).find((k) => k.includes('id'));
      const cleanedId = key ? data[key] : undefined;
      results.push({
        id: Number(cleanedId),
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
        isLegendary: data.legendary === 'true', // so sánh chuỗi
        image: data.image,
        ytbUrl: data.ytbUrl,
      });
    })
    .on('end', async () => {
      try {
        const existingIds = await PokemonModel.find(
          { id: { $in: results.map((r) => r.id) } },
          { id: 1 }
        ).lean();

        const existingIdSet = new Set(existingIds.map((p) => p.id));
        const newPokemons = results.filter((p) => !existingIdSet.has(p.id));

        if (newPokemons.length === 0) {
          return res
            .status(409)
            .json({ message: 'All Pokemon in the file already exist.' });
        }

        await PokemonModel.insertMany(newPokemons);
        res.json({
          message: `Imported successfully ${newPokemons.length} Pokemon(s).`,
          count: newPokemons.length,
          skipped: existingIds.length,
        });
      } catch (error) {
        res
          .status(500)
          .json({ error: 'Failed to import data', details: error });
      } finally {
        fs.unlinkSync(req.file!.path);
      }
    });
});

/**
 * @route GET /api/pokemon
 * @desc Get Pokemon list with filter, pagination
 */
router.get('/', async (req, res) => {
  const {
    page = 1,
    limit = 20,
    name,
    type,
    isLegendary,
    minSpeed,
    maxSpeed,
  } = req.query;

  const filter: any = {};
  const isValid = (value) =>
    value !== undefined && value !== null && value !== 'null';
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (type) filter.$or = [{ type1: type }, { type2: type }];
  if (isLegendary === 'true') filter.isLegendary = true;
  if (isValid(minSpeed))
    filter.speed = { ...(filter.speed || {}), $gte: Number(minSpeed) };
  if (isValid(maxSpeed))
    filter.speed = { ...(filter.speed || {}), $lte: Number(maxSpeed) };
  const pokemons = await PokemonModel.find(filter)
    .skip((+page - 1) * +limit)
    .limit(+limit);

  const total = await PokemonModel.countDocuments(filter);

  res.json({ total, page: +page, limit: +limit, data: pokemons });
});

/**
 * @route GET /api/pokemon/types
 * @desc Get Pokemon types
 */
router.get('/types', async (req, res) => {
  const type1List = await PokemonModel.distinct('type1');
  const type2List = await PokemonModel.distinct('type2');
  const uniqueTypes = Array.from(new Set([...type1List, ...type2List])).sort();
  res.json(uniqueTypes);
});

/**
 * @route GET /api/pokemon/favorites
 * @desc Get Pokemon favorites
 */
router.get('/favorites', async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  const favorites = await FavoriteModel.find({ userId }).populate('pokemonId');
  const pokemonList = favorites.map((fav) => fav.pokemonId).filter(Boolean);

  res.json({ data: pokemonList });
});

/**
 * @route POST /api/pokemon/favorites
 * @desc Add Pokemon to favorites
 */
router.post('/favorites', async (req, res) => {
  const { userId, pokemonId } = req.body;

  try {
    const result = await FavoriteModel.updateOne(
      { userId, pokemonId },
      { $setOnInsert: { userId, pokemonId } },
      { upsert: true }
    );

    const isInserted = result.upsertedCount > 0;

    return res.json({
      message: isInserted ? 'Added to favorites' : 'Already favorited',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/pokemon/favorites
 * @desc Remove Pokemon from favorites
 */
router.delete('/favorites', async (req, res) => {
  const { userId, pokemonId } = req.body;

  await FavoriteModel.deleteOne({ userId, pokemonId });

  res.json({ message: 'Removed from favorites' });
});

/**
 * @route GET /api/pokemon/:id
 * @desc Get detail of a Pokemon by id
 */
router.get('/:id', async (req, res) => {
  const pokemon = await PokemonModel.findById(req.params.id);
  if (!pokemon) return res.status(404).json({ error: 'Not found' });
  res.json(pokemon);
});

export default router;
