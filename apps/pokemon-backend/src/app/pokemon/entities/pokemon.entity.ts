import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type1: string;

  @Column({ nullable: true })
  type2: string;

  @Column()
  total: number;

  @Column()
  hp: number;

  @Column()
  attack: number;

  @Column()
  defense: number;

  @Column()
  spAtk: number;

  @Column()
  spDef: number;

  @Column()
  speed: number;

  @Column()
  generation: number;

  @Column({ default: false })
  isLegendary: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  ytbUrl: string;
}
