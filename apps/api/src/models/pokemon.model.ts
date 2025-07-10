import { Schema, model } from 'mongoose';

const pokemonSchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    type1: { type: String, required: true },
    type2: { type: String, required: false, default: null },
    total: { type: Number },
    hp: { type: Number },
    attack: { type: Number },
    defense: { type: Number },
    spAttack: { type: Number },
    spDefense: { type: Number },
    speed: { type: Number },
    generation: { type: Number },
    isLegendary: { type: Boolean },
    image: { type: String },
    ytbUrl: { type: String },
  },
  { timestamps: true }
);

export const PokemonModel = model('Pokemon', pokemonSchema);
