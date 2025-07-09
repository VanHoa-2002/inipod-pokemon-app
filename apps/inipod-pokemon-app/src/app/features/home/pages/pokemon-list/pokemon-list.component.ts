import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Observable, of, Subject } from 'rxjs';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { PayloadFilter, Pokemon } from '../../../models/pokemon-list.model';
import { VideoCarouselComponent } from '../video-carousel/video-carousel.component';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VideoCarouselComponent,
  ],
  providers: [ToastrService],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  searchSubject = new Subject<string>();
  payloadFilter: PayloadFilter = {
    name: '',
    type: '',
    isLegendary: undefined,
    minSpeed: 0,
    maxSpeed: 200,
    page: 1,
    limit: 20,
  };
  totalItems = 0;
  favoriteIds: Set<number> = new Set();
  pokemonTypes$: Observable<string[]> = of([]);
  private toastr = inject(ToastrService);
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = false;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.payloadFilter = {
        name: params['name'] || '',
        type: params['type'] || '',
        isLegendary: params['isLegendary'] === 'true' ? true : undefined,
        minSpeed: Number(params['minSpeed']) || 0,
        maxSpeed: Number(params['maxSpeed']) || 200,
        page: Number(params['page']) || 1,
        limit: Number(params['limit']) || 20,
      };
      this.loadPokemons();
    });

    // Debounced search control
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.payloadFilter.name = value;
      this.payloadFilter.page = 1;
      this.updateQueryParamsAndLoad();
    });
    this.pokemonTypes$ = this.pokemonService.getTypes();
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  onFilterChange() {
    this.payloadFilter.page = 1;
    this.updateQueryParamsAndLoad();
  }

  toggleFavorite(pokemon: Pokemon) {
    if (this.favoriteIds.has(pokemon.id)) {
      this.favoriteIds.delete(pokemon.id);
    } else {
      this.favoriteIds.add(pokemon.id);
    }
  }

  updateQueryParamsAndLoad() {
    this.updateQueryParams();
    this.loadPokemons();
  }

  updateQueryParams() {
    this.router.navigate([], {
      queryParams: this.payloadFilter,
      queryParamsHandling: 'merge',
    });
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(this.payloadFilter).subscribe({
      next: (res) => {
        this.pokemons = res.data ?? [];
        this.totalItems = res.total ?? 0;
      },
      error: (err) => console.error('API Error:', err),
      complete: () => {
        this.loading = false;
        this.toastr.success('Load Pokemons Success', 'Success');
      },
    });
  }
  trackByFn(index: number, item: any) {
    return item._id;
  }
  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.payloadFilter.page = newPage;
      this.updateQueryParamsAndLoad();
    }
  }

  onLimitChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.payloadFilter.limit = Number(target.value);
    this.payloadFilter.page = 1;
    this.updateQueryParamsAndLoad();
  }

  onImportCSV(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.loading = true;
      this.pokemonService.importCSV(file).subscribe({
        next: () => {
          this.loadPokemons();
          this.toastr.success('CSV Import Success', 'Success');
        },
        error: (err) => {
          this.toastr.error('CSV Import Error:', err);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / (this.payloadFilter.limit ?? 20));
  }

  get pageRange(): string {
    const page = this.payloadFilter.page ?? 1;
    const limit = this.payloadFilter.limit ?? 20;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, this.totalItems);
    return `Showing ${start}-${end} of ${this.totalItems}`;
  }
}
