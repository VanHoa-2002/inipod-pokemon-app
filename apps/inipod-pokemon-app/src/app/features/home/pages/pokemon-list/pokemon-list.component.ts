import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, Observable, of, Subject, tap } from 'rxjs';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { PayloadFilter, Pokemon } from '../../../models/pokemon-list.model';
import { VideoCarouselComponent } from '../video-carousel/video-carousel.component';
import { SafeYoutubePipe } from '../../../utils/safe-youtube.pipe';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VideoCarouselComponent,
    SafeYoutubePipe,
  ],
  providers: [ToastrService],
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemons: Pokemon[] = [];
  searchSubject = new Subject<string>();
  payloadFilter: PayloadFilter = {
    name: '',
    type: '',
    isLegendary: undefined,
    minSpeed: 0,
    maxSpeed: 1000,
    page: 1,
    limit: 20,
  };
  totalItems = 0;
  favoriteIds: Set<string> = new Set();
  pokemonTypes$: Observable<string[]> = of([]);
  private toastr = inject(ToastrService);
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loading = false;
  userId = localStorage.getItem('userId') ?? '';
  isFirstLoad = true;
  isHaveData = false;
  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscape);
    if (this.userId) {
      this.pokemonService
        .getFavorites(this.userId)
        .pipe(
          map((res) => {
            if (res?.data?.length > 0) {
              this.favoriteIds = new Set(res.data.map((p) => p._id));
            }
          })
        )
        .subscribe();
    }
    this.route.queryParams.subscribe((params) => {
      this.payloadFilter = {
        name: params['name'] || '',
        type: params['type'] || '',
        isLegendary: params['isLegendary'] === 'true' ? true : undefined,
        minSpeed: Number(params['minSpeed']) || 0,
        maxSpeed: Number(params['maxSpeed']) || 1000,
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
  onFavoriteClick(event: MouseEvent, pokemon: Pokemon) {
    event.stopPropagation();
    this.toggleFavorite(pokemon);
  }
  toggleFavorite(pokemon: Pokemon) {
    const id = pokemon._id;
    if (this.favoriteIds.has(id)) {
      this.pokemonService.removeFavorite(this.userId, id).subscribe(() => {
        this.favoriteIds.delete(id);
        this.toastr.info('Remove from favorite', 'Information');
      });
    } else {
      this.pokemonService.addFavorite(this.userId, id).subscribe(() => {
        this.favoriteIds.add(id);
        this.toastr.success('Add to favorite', 'Success');
      });
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
      error: () => {
        this.toastr.error('Load Pokemons Error', 'Error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        if (this.isFirstLoad) {
          this.isFirstLoad = false;
        } else {
          this.toastr.success('Load Pokemons Success', 'Success');
        }
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
  toggleScrollbar(isHide = false) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (isHide) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    }
  }
  onImportCSV(event: Event, input: HTMLInputElement) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.loading = true;
      this.toggleScrollbar(true);
      this.pokemonService.importCSV(file).subscribe({
        next: () => {
          this.loadPokemons();
          this.toastr.success('CSV Import Success', 'Success');
        },
        error: (err) => {
          input.value = '';
          this.toastr.error(err.error?.message || 'CSV Import Error', 'Error');
          this.loading = false;
          this.toggleScrollbar();
        },
        complete: () => {
          input.value = '';
          this.loading = false;
          this.toggleScrollbar();
          this.pokemonService.notifyImportSuccess();
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
    const start = this.totalItems > 0 ? (page - 1) * limit + 1 : 0;
    const end = Math.min(page * limit, this.totalItems);
    return `Showing ${start}-${end} of ${this.totalItems}`;
  }
  selectedPokemon: Pokemon | null = null;

  openModal(pokemon: Pokemon) {
    this.pokemonService
      .getDetailPokemon(pokemon._id)
      .pipe(
        tap((res) => {
          this.selectedPokemon = res;
        })
      )
      .subscribe();
    this.toggleScrollbar(true);
  }

  closeModal() {
    this.selectedPokemon = null;
    this.toggleScrollbar();
  }
  handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  };
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscape);
  }
}
