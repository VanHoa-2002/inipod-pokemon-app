import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    pokemonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pokemon',
    },
  },
  { timestamps: true }
);

export const FavoriteModel = mongoose.model('Favorite', favoriteSchema);
