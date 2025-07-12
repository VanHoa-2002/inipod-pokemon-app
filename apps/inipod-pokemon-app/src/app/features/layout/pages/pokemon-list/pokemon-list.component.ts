import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, Observable, of, Subject, tap } from 'rxjs';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { PayloadFilter, Pokemon } from '../../../models/pokemon-list.model';
import { CardItemComponent } from '../card-item/card-item.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../../core/store/auth/auth.selector';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardItemComponent],
  providers: [ToastrService],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  searchSubject = new Subject<string>();
  payloadFilter: PayloadFilter = {
    name: '',
    type: '',
    isLegendary: false,
    minSpeed: 0,
    maxSpeed: 1000,
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
  private store = inject(Store);
  loading = false;
  userId = '';
  isFirstLoad = true;

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user) => {
      this.userId = user?.userId || '';
    });

    this.route.queryParams.subscribe((params) => {
      this.payloadFilter = {
        name: params['name'] || '',
        type: params['type'] || '',
        isLegendary: params['isLegendary'] === 'true',
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

  /**
   * On search
   * @param value - The value
   */
  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  /**
   * On filter change
   */
  onFilterChange() {
    this.payloadFilter.page = 1;
    this.updateQueryParamsAndLoad();
  }

  /**
   * Update the query params and load the pokemons
   */
  updateQueryParamsAndLoad() {
    this.updateQueryParams();
    this.loadPokemons();
  }

  /**
   * Update the query params
   */
  updateQueryParams() {
    this.router.navigate([], {
      queryParams: this.payloadFilter,
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Load the pokemons
   */
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

  /**
   * Track by function
   * @param index - The index
   * @param item - The item
   * @returns - The id of the item
   */
  trackByFn(index: number, item: any) {
    return item._id;
  }

  /**
   * On page change
   * @param newPage - The new page
   */
  onPageChange(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.payloadFilter.page = newPage;
      this.updateQueryParamsAndLoad();
    }
  }

  /**
   * On limit change
   * @param event - The event
   */
  onLimitChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.payloadFilter.limit = Number(target.value);
    this.payloadFilter.page = 1;
    this.updateQueryParamsAndLoad();
  }
  /**
   * Toggle the scrollbar
   * @param isHide - The is hide
   */
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

  /**
   * On import CSV
   * @param event - The event
   * @param input - The input
   */
  onImportCSV(event: Event, input: HTMLInputElement) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.loading = true;
      this.toggleScrollbar(true);
      this.pokemonService.importCSV(file).subscribe({
        next: (res) => {
          if (res.hasChanged) {
            this.loadPokemons();
            this.toastr.success(res.message, 'Success');
          } else {
            this.toastr.info(`No new pokemons imported`, 'Information');
          }
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
        },
      });
    }
  }

  /**
   * Get the total pages
   * @returns - The total pages
   */
  get totalPages(): number {
    return Math.ceil(this.totalItems / (this.payloadFilter.limit ?? 20));
  }

  /**
   * Get the page range
   * @returns - The page range
   */
  get pageRange(): string {
    const page = this.payloadFilter.page ?? 1;
    const limit = this.payloadFilter.limit ?? 20;
    const start = this.totalItems > 0 ? (page - 1) * limit + 1 : 0;
    const end = Math.min(page * limit, this.totalItems);
    return `Showing ${start}-${end} of ${this.totalItems}`;
  }
}
