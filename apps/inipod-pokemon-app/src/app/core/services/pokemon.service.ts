import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PayloadFilter,
  PokemonListResponse,
} from '../../features/models/pokemon-list.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

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
}
