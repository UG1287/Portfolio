import { Component, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LogoComponent } from '../../logo/logo.component';
import { PLATFORM_ID } from '@angular/core';

/**
 * HeaderComponent
 *
 * Represents the top navigation bar of the application.
 * Provides:
 * - Responsive menu toggle for mobile devices.
 * - Smooth section scrolling for in-page navigation.
 * - Language switching using ngx-translate.
 * - Active section highlighting via IntersectionObserver.
 *
 * Ensures all DOM operations run safely only in the browser context.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  /** The ID of the currently active section in view. */
  activeSection: string = '';

  /** IntersectionObserver instance used for tracking visible sections. */
  private io?: IntersectionObserver;

  /** Indicates whether the mobile menu is currently open. */
  isMenuOpen = false;

  /** Currently selected language code (e.g., 'en' or 'de'). */
  currentLang = this.translate.currentLang || 'de';

  /** True if the component is executing in a browser environment. */
  private readonly isBrowser: boolean;

  /**
   * Creates an instance of HeaderComponent.
   * @param translate The translation service for handling multilingual support.
   * @param platformId Angular's platform identifier to detect SSR vs. browser runtime.
   * @param doc The global Document object for DOM manipulation and scroll control.
   */
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Toggles the visibility of the mobile navigation menu.
   * Prevents background scrolling when the menu is open.
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isBrowser) {
      this.doc.body.classList.toggle('no-scroll', this.isMenuOpen);
    }
  }

  /**
   * Closes the mobile navigation menu and restores page scrolling.
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    if (this.isBrowser) {
      this.doc.body.classList.remove('no-scroll');
    }
  }

  /**
   * Handles navigation link clicks by scrolling to the target section
   * and closing the mobile menu afterward.
   *
   * @param event - The click event from a navigation link.
   * @param id - The target section ID to scroll to.
   */
  navigate(event: Event, id: string): void {
    this.scrollToSection(event, id);
    this.closeMenu();
  }

  /**
   * Lifecycle hook that initializes an IntersectionObserver
   * to track which section of the page is currently visible.
   * Updates `activeSection` accordingly for active-link highlighting.
   */
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    if (!('IntersectionObserver' in globalThis)) return;

    const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];

    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection = (entry.target as HTMLElement).id;
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    for (const id of sectionIds) {
      const el = this.doc.getElementById(id);
      if (el) this.io.observe(el);
    }
  }

  /**
   * Lifecycle hook that disconnects the IntersectionObserver
   * when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  /**
   * Smoothly scrolls the viewport to the specified section.
   * Prevents default link behavior and executes only in browser.
   *
   * @param event - The triggering click event.
   * @param id - The ID of the target DOM element.
   */
  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    if (!this.isBrowser) return;

    const el = this.doc.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Switches the application language at runtime.
   * Updates both the translation service and local state.
   *
   * @param lang - The language code to switch to.
   */
  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
