import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PokemonService } from '../../../../core/services/pokemon.service';
import { Pokemon } from '../../../models/pokemon-list.model';

@Component({
  standalone: true,
  selector: 'app-video-carousel',
  imports: [CommonModule],
  templateUrl: './video-carousel.component.html',
})
export class VideoCarouselComponent implements OnInit {
  pokemonsWithVideo: Pokemon[] = [];
  currentIndex = 0;
  private sanitizer = inject(DomSanitizer);
  private pokemonService = inject(PokemonService);
  ngOnInit(): void {
    this.pokemonService
      .getPokemons({
        page: 1,
        limit: 4,
      })
      .subscribe((res) => {
        this.pokemonsWithVideo = res.data;
      });
  }
  getSafeUrl(url: string, index: number): SafeResourceUrl {
    const id = this.extractVideoId(url);
    const autoplay = index === this.currentIndex ? 'autoplay=1' : 'autoplay=0';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?${autoplay}&mute=1`
    );
  }

  extractVideoId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([\w-]{11})/);
    return match?.[1] || '';
  }

  getTranslateX() {
    const itemWidth = 100;
    const gapSize = 16;
    const gapInPercentage = (gapSize / this.getContainerWidth()) * 100;
    const offset = this.currentIndex * (itemWidth + gapInPercentage);
    return `translateX(-${offset}%)`;
  }

  getContainerWidth() {
    return (
      document.querySelector('.relative')?.getBoundingClientRect().width || 1
    );
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.pokemonsWithVideo.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.pokemonsWithVideo.length) %
      this.pokemonsWithVideo.length;
  }
}
