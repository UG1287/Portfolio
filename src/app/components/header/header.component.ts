import { Component, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LogoComponent } from '../../logo/logo.component';
import { PLATFORM_ID } from '@angular/core';

/**
 * HeaderComponent
 *
 * The application's top navigation bar.
 *
 * Responsibilities:
 * - Mobile menu toggle including background scroll locking.
 * - Smooth in-page section navigation.
 * - Language switching through ngx-translate.
 * - Active section highlighting via IntersectionObserver.
 *
 * Includes SSR-safe guards to avoid DOM access when not running in the browser.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  /** Stores the ID of the currently visible page section. */
  activeSection: string = '';

  /** IntersectionObserver used to detect visible sections on scroll. */
  private io?: IntersectionObserver;

  /** Indicates whether the mobile navigation menu is opened. */
  isMenuOpen = false;

  /** The currently active language code. */
  currentLang = this.translate.currentLang || 'de';

  /** True only when running inside a browser environment. */
  private readonly isBrowser: boolean;

  /**
   * Creates an instance of HeaderComponent.
   * Injects translation service, platform info, and document reference.
   *
   * @param translate - Translation service from ngx-translate.
   * @param platformId - Angular platform identifier for SSR/browser detection.
   * @param doc - The global document object for DOM-based operations.
   */
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Toggles the mobile navigation menu.
   * Adds or removes a scroll-locking class on the body element.
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isBrowser) {
      this.doc.body.classList.toggle('no-scroll', this.isMenuOpen);
    }
  }

  /**
   * Closes the mobile menu and restores background scrolling.
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    if (this.isBrowser) {
      this.doc.body.classList.remove('no-scroll');
    }
  }

  /**
   * AfterViewInit lifecycle hook.
   *
   * Initializes an IntersectionObserver to monitor which sections
   * are currently visible in the viewport. This enables highlighting
   * the corresponding navigation link.
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
   * OnDestroy lifecycle hook.
   * Disconnects the IntersectionObserver to avoid memory leaks.
   */
  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  /**
   * Smoothly scrolls to a specific section of the page.
   * Ensures safe browser execution and prevents default anchor behavior.
   *
   * Features:
   * - Closes mobile menu before scrolling.
   * - Waits for layout to stabilize before calculating offsets.
   * - Scrolls to the first heading inside the section if available.
   * - Adjusts for sticky header height.
   * - Updates the URL hash without triggering native scroll.
   *
   * @param event - The click event triggering the scroll.
   * @param id - The ID of the target section element.
   */
  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    try {
      event.stopImmediatePropagation?.();
    } catch {}

    if (!this.isBrowser) return;

    const section = this.doc.getElementById(id);
    if (!section) {
      this.closeMenu();
      return;
    }

    this.closeMenu();

    const win = this.doc.defaultView ?? window;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const heading = section.querySelector(
          'h1, h2, h3'
        ) as HTMLElement | null;
        const target = heading ?? section;

        const headerEl = this.doc.querySelector(
          '.header'
        ) as HTMLElement | null;
        const headerHeight = headerEl?.offsetHeight ?? 0;

        const currentScroll = win.scrollY ?? (win as any).pageYOffset ?? 0;

        const targetTop =
          target.getBoundingClientRect().top + currentScroll - headerHeight - 8;

        win.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });

        try {
          win.history.replaceState(null, '', `#${id}`);
        } catch {}
      });
    });
  }

  /**
   * Changes the active application language.
   * Updates both the translate service and local state.
   *
   * @param lang - Language code to switch to.
   */
  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
