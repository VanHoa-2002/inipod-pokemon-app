import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PokemonService } from '../../../../core/services/pokemon.service';

@Component({
  standalone: true,
  selector: 'app-video-carousel',
  imports: [CommonModule],
  templateUrl: './video-carousel.component.html',
})
export class VideoCarouselComponent {
  pokemonsWithVideo: any[] = [];
  private sanitizer = inject(DomSanitizer);
  private pokemonService = inject(PokemonService);

  ngOnInit() {
    this.pokemonService.getPokemons().subscribe((res) => {
      this.pokemonsWithVideo = res.data
        .filter((p: any) => p.ytbUrl)
        .slice(0, 4);
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
    const id = this.extractVideoId(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${id}`
    );
  }

  extractVideoId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([\w-]{11})/);
    return match?.[1] || '';
  }
}
