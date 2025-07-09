import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { VideoCarouselComponent } from '../video-carousel/video-carousel.component';

@Component({
  standalone: true,
  selector: 'app-pokemon-list',
  imports: [CommonModule, VideoCarouselComponent],
  templateUrl: './pokemon-list.component.html',
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];

  private pokemonService = inject(PokemonService);

  ngOnInit() {
    this.pokemonService.getPokemons().subscribe({
      next: (res) => {
        this.pokemons = res.data;
      },
      error: (err) => {
        console.error('Failed to fetch pokemons:', err);
      },
    });
  }
}
