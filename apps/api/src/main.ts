import express from 'express';
import * as path from 'path';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route';
import pokemonRouter from './routes/pokemon.route';

const app = express();
const port = process.env.PORT || 3333;
const mongoUri =
  process.env.MONGO_URI || 'mongodb://localhost:27017/pokemon-app';

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api/auth', authRouter);
app.use('/api/pokemon', pokemonRouter);
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}/api`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
