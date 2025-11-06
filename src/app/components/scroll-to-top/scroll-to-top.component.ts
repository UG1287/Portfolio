import { Component, HostListener, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * ScrollToTopComponent
 *
 * Displays a floating "scroll to top" button when the user scrolls down the page.
 * The button appears after a defined scroll threshold and, when clicked,
 * smoothly scrolls the viewport back to the top.
 *
 * The component is SSR-safe and executes DOM operations only in the browser.
 */
@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
})
export class ScrollToTopComponent {
  /** Determines whether the scroll-to-top button is currently visible. */
  showButton = false;

  /** Indicates whether the component is running in a browser environment. */
  private readonly isBrowser: boolean;

  /**
   * Creates an instance of ScrollToTopComponent.
   * @param platformId Angular's platform identifier to detect SSR vs. browser.
   * @param doc The global Document object for reading scroll position.
   */
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Host listener for the window scroll event.
   * Toggles the visibility of the scroll-to-top button when the user scrolls
   * beyond a vertical threshold of 300 px.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const y =
      typeof window !== 'undefined' && 'scrollY' in window
        ? window.scrollY
        : this.doc?.documentElement?.scrollTop || 0;

    this.showButton = y > 300;
  }

  /**
   * Smoothly scrolls the window back to the top of the page.
   * Executes only in the browser context.
   */
  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
