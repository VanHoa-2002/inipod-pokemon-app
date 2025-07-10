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

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    this.loadVideoData();
  }

  /**
   * Load the video data
   */
  loadVideoData() {
    this.pokemonService
      .getPokemons({
        page: 1,
        limit: 4,
      })
      .subscribe((res) => {
        this.pokemonsWithVideo = res.data;
      });
  }

  /**
   * Get the safe URL
   * @param url - The URL
   * @param index - The index
   * @returns - The safe URL
   */
  getSafeUrl(url: string, index: number): SafeResourceUrl {
    const id = this.extractVideoId(url);
    const autoplay = index === this.currentIndex ? 'autoplay=1' : 'autoplay=0';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}?${autoplay}&mute=1`
    );
  }

  /**
   * Extract the video ID
   * @param url - The URL
   * @returns - The video ID
   */
  extractVideoId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([\w-]{11})/);
    return match?.[1] || '';
  }

  /**
   * Get the translate X
   * @returns - The translate X
   */
  getTranslateX() {
    const itemWidth = 100;
    const gapSize = 16;
    const gapInPercentage = (gapSize / this.getContainerWidth()) * 100;
    const offset = this.currentIndex * (itemWidth + gapInPercentage);
    return `translateX(-${offset}%)`;
  }

  /**
   * Get the container width
   * @returns - The container width
   */
  getContainerWidth() {
    return (
      document.querySelector('.relative')?.getBoundingClientRect().width || 1
    );
  }

  /**
   * Next slide
   */
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.pokemonsWithVideo.length;
  }

  /**
   * Previous slide
   */
  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.pokemonsWithVideo.length) %
      this.pokemonsWithVideo.length;
  }
}
