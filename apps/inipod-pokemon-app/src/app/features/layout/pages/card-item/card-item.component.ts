import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { Pokemon } from '../../../models/pokemon-list.model';
import { SafeYoutubePipe } from '../../../utils/safe-youtube.pipe';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule, SafeYoutubePipe],
  templateUrl: './card-item.component.html',
})
export class CardItemComponent implements OnInit, OnDestroy {
  @Input() pokemon!: Pokemon;
  @Input() favoriteIds: Set<string> = new Set();
  @Output() toggleScrollbar = new EventEmitter<boolean>();
  @Input() userId = '';
  @Input() isAllowClickDetail = false;
  private pokemonService = inject(PokemonService);
  private toastr = inject(ToastrService);
  selectedPokemon: Pokemon | null = null;

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    document.addEventListener('keydown', this.handleEscape, { passive: true });
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
  }

  /**
   * Handle the escape key
   * @param event - The keyboard event
   */
  handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  };

  /**
   * Open the modal
   * @param pokemon - The pokemon
   */
  openModal(pokemon: Pokemon) {
    this.pokemonService
      .getDetailPokemon(pokemon._id)
      .pipe(
        tap((res) => {
          this.selectedPokemon = res;
        })
      )
      .subscribe();
    this.toggleScrollbar.emit(true);
  }

  /**
   * On favorite click
   * @param event - The mouse event
   * @param pokemon - The pokemon
   */
  onFavoriteClick(event: MouseEvent, pokemon: Pokemon) {
    event.stopPropagation();
    this.toggleFavorite(pokemon);
  }

  /**
   * Toggle the favorite
   * @param pokemon - The pokemon
   */
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

  /**
   * Close the modal
   */
  closeModal() {
    this.selectedPokemon = null;
    this.toggleScrollbar.emit(false);
  }

  /**
   * Destroy the component
   */
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEscape);
  }
}
