import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * AboutComponent
 *
 * Displays the "About" section of the application, providing personal or
 * contextual information about the portfolio owner.
 *
 * Includes smooth in-page scrolling functionality and ensures all
 * DOM interactions are executed only in the browser (SSR-safe).
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  /**
   * Creates an instance of AboutComponent.
   * @param doc The global Document object, injected for safe DOM manipulation.
   * @param platformId Angular's platform identifier to detect SSR vs browser runtime.
   */
  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  /**
   * Smoothly scrolls to a specific element on the page by ID.
   * Prevents the default link behavior and executes only in the browser environment.
   *
   * @param id - The ID of the target DOM element to scroll to.
   * @param event - Optional event object to prevent default navigation behavior.
   */
  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return; // SSR-safe
    const el = this.doc.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
