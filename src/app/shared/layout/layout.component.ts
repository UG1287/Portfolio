import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';

/**
 * LayoutComponent
 *
 * Provides the global layout structure of the application including
 * header, footer, router outlet, and scroll-to-top behavior.
 * 
 * Additionally, it initializes the AOS (Animate On Scroll) library
 * only on the browser platform to enable entry animations.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements AfterViewInit {

  /**
   * Injects the current platform ID to conditionally execute browser-only code.
   * @param platformId Angular's PLATFORM_ID token
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Lifecycle hook that runs after the component’s view initialization.
   * Initializes the AOS (Animate On Scroll) library only in the browser.
   */
  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const { default: AOS } = await import('aos');
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-in-out',
      offset: 60,
      startEvent: 'DOMContentLoaded',
    });

    requestAnimationFrame(() => AOS.refresh());
  }
}
