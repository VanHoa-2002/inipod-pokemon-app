import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { PokemonModel } from '../models/pokemon.model';

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

/**
 * @route POST /api/pokemon/import
 * @desc Import Pokémon data from CSV
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
        await PokemonModel.insertMany(results);
        res.json({ message: 'Imported successfully', count: results.length });
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
 * @desc Get Pokémon list with filter, pagination
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
 * @desc Get Pokémon types
 */
router.get('/types', async (req, res) => {
  const type1List = await PokemonModel.distinct('type1');
  const type2List = await PokemonModel.distinct('type2');
  const uniqueTypes = Array.from(new Set([...type1List, ...type2List])).sort();
  res.json(uniqueTypes);
});

/**
 * @route GET /api/pokemon/:id
 * @desc Get detail of a Pokémon by id
 */
router.get('/:id', async (req, res) => {
  const pokemon = await PokemonModel.findById(req.params.id);
  if (!pokemon) return res.status(404).json({ error: 'Not found' });
  res.json(pokemon);
});

export default router;
