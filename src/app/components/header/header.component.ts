import { Component, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LogoComponent } from '../../logo/logo.component';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  activeSection: string = '';
  private io?: IntersectionObserver;
  isMenuOpen = false;
  currentLang = this.translate.currentLang || 'de';

  private readonly isBrowser: boolean;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isBrowser) {
      this.doc.body.classList.toggle('no-scroll', this.isMenuOpen);
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    if (this.isBrowser) {
      this.doc.body.classList.remove('no-scroll');
    }
  }

  navigate(event: Event, id: string) {
    this.scrollToSection(event, id);
    this.closeMenu();
  }

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

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    const el = this.doc.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
