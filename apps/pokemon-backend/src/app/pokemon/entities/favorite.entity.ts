import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pokemon } from './pokemon.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => Pokemon)
  @JoinColumn({ name: 'pokemonId' })
  pokemon: Pokemon;

  @Column()
  pokemonId: number;
}
