export interface PayloadFilter {
  name?: string;
  type?: string;
  isLegendary?: boolean;
  minSpeed?: number;
  maxSpeed?: number;
  page: number;
  limit: number;
  isPagination?: boolean;
}
export interface PokemonListResponse {
  total: number;
  page: number;
  limit: number;
  data: Pokemon[];
}

export interface Pokemon {
  _id: string;
  id: number;
  name: string;
  type1: string;
  type2?: string;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  generation: number;
  isLegendary: boolean;
  image: string;
  ytbUrl: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
