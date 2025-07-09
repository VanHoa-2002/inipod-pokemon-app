import express from 'express';
import * as path from 'path';
import mongoose from 'mongoose';
import authRouter from './routes/auth.route';
import pokemonRouter from './routes/pokemon.route';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const mongoUri =
  process.env.MONGO_URI || 'mongodb://localhost:27017/pokemon-app';
app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);
// Middleware
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// Route test
app.use('/api/', (req, res) => {
  res.json({
    message: 'Backend server is running successfully!',
  });
});
// Route auth
app.use('/api/auth', authRouter);
// Route pokemon
app.use('/api/pokemon', pokemonRouter);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(`Connected to MongoDB in port ${port}`);
    app.listen(port, () => {
      console.log(`API running at http://localhost:${port}/api`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
