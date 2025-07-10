import { Component, inject, OnInit } from '@angular/core';
import { VideoCarouselComponent } from '../video-carousel/video-carousel.component';
import { CommonModule } from '@angular/common';
import { PayloadFilter, Pokemon } from '../../../models/pokemon-list.model';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { ToastrService } from 'ngx-toastr';
import { CardItemComponent } from '../card-item/card-item.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  standalone: true,
  imports: [VideoCarouselComponent, CommonModule, CardItemComponent],
})
export class HomePageComponent implements OnInit {
  username = localStorage.getItem('username') || 'User';
  pokemons: Pokemon[] = [];
  loading = true;
  favoriteIds: Set<string> = new Set();
  userId = localStorage.getItem('userId') ?? '';
  private pokemonService = inject(PokemonService);
  private toastr = inject(ToastrService);

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    const payloadFilter: PayloadFilter = {
      page: 1,
      limit: 10,
    };
    this.pokemonService
      .getPokemons(payloadFilter)
      .subscribe((pokemonListResponse) => {
        this.pokemons = pokemonListResponse.data;
        this.loading = false;
      });
  }

  /**
   * Track by function
   * @param index - The index
   * @param pokemon - The pokemon
   * @returns - The id of the pokemon
   */
  trackByFn = (index: number, pokemon: Pokemon) => pokemon.id;

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
}
