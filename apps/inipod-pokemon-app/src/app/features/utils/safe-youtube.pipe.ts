import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeYoutube',
  standalone: true,
})
export class SafeYoutubePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  /**
   * Transform the original URL
   * @param originalUrl - The original URL
   * @returns - The safe resource URL
   */
  transform(originalUrl: string): SafeResourceUrl {
    if (!originalUrl) return '';

    const videoIdMatch = originalUrl.match(
      /(?:v=|\/embed\/|\.be\/)([\w-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : '';

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
