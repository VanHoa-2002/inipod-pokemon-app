import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  PayloadFilter,
  Pokemon,
  PokemonListResponse,
} from '../../features/models/pokemon-list.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}
  private importSuccessSubject = new Subject<void>();
  importSuccess$ = this.importSuccessSubject.asObservable();

  notifyImportSuccess() {
    this.importSuccessSubject.next();
  }
  getPokemons(payloadFilter: PayloadFilter) {
    return this.http.get<PokemonListResponse>('/api/pokemon', {
      params: payloadFilter as any,
    });
  }
  importCSV(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/pokemon/import', formData);
  }
  getTypes(): Observable<string[]> {
    return this.http.get<string[]>('/api/pokemon/types');
  }
  getFavorites(userId: string) {
    return this.http.get<{ data: Pokemon[] }>(
      `/api/pokemon/favorites?userId=${userId}`
    );
  }
  getDetailPokemon(id: string) {
    return this.http.get<Pokemon>(`/api/pokemon/${id}`);
  }
  addFavorite(userId: string, pokemonId: string) {
    return this.http.post(`/api/pokemon/favorites`, { userId, pokemonId });
  }

  removeFavorite(userId: string, pokemonId: string) {
    return this.http.delete(`/api/pokemon/favorites`, {
      body: { userId, pokemonId },
    });
  }
}
