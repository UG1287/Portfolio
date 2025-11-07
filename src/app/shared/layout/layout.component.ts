import { Component, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ScrollToTopComponent } from '../../components/scroll-to-top/scroll-to-top.component';
import { filter, Subscription } from 'rxjs';

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
export class LayoutComponent implements AfterViewInit, OnDestroy {
  private sub?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document,
    private router: Router
  ) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    // AOS as before
    const { default: AOS } = await import('aos');
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-in-out',
      offset: 60,
      startEvent: 'DOMContentLoaded',
    });
    requestAnimationFrame(() => AOS.refresh());

    // Tag <body> on legal routes to hide the fixed green line only there
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const url = e.urlAfterRedirects || e.url;
        const isLegal =
          url.startsWith('/impressum') || url.startsWith('/datenschutz');

        this.doc.body.classList.toggle('is-legal-page', isLegal);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
