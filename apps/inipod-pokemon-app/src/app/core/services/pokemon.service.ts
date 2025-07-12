import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PayloadFilter,
  Pokemon,
  PokemonListResponse,
} from '../../features/models/pokemon-list.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);

  /**
   * Get the list of pokemons
   * @param payloadFilter - The payload filter
   * @returns - The list of pokemons
   */
  getPokemons(payloadFilter: PayloadFilter) {
    return this.http.get<PokemonListResponse>('/api/pokemon', {
      params: payloadFilter as any,
    });
  }

  /**
   * Import a CSV file
   * @param file - The CSV file
   * @returns - The message
   */
  importCSV(
    file: File
  ): Observable<{ message: string; skipped: number; hasChanged: boolean }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{
      message: string;
      skipped: number;
      hasChanged: boolean;
    }>('/api/pokemon/import', formData);
  }

  /**
   * Get the list of types
   * @returns - The list of types
   */
  getTypes(): Observable<string[]> {
    return this.http.get<string[]>('/api/pokemon/types');
  }

  /**
   * Get the list of favorites
   * @param userId - The user id
   * @returns - The list of favorites
   */
  getFavorites(userId: string) {
    return this.http.get<Pokemon[]>(`/api/pokemon/favorites?userId=${userId}`);
  }

  /**
   * Get the detail of a pokemon
   * @param id - The id of the pokemon
   * @returns - The detail of the pokemon
   */
  getDetailPokemon(id: number) {
    return this.http.get<Pokemon>(`/api/pokemon/${id}`);
  }

  /**
   * Add a favorite
   * @param userId - The user id
   * @param pokemonId - The pokemon id
   * @returns - The message
   */
  addFavorite(userId: string, pokemonId: number) {
    return this.http.post(`/api/pokemon/favorites`, { userId, pokemonId });
  }

  /**
   * Remove a favorite
   * @param userId - The user id
   * @param pokemonId - The pokemon id
   * @returns - The message
   */
  removeFavorite(userId: string, pokemonId: number) {
    return this.http.delete(`/api/pokemon/favorites`, {
      body: { userId, pokemonId },
    });
  }
}
