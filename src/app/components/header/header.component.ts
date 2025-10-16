import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LogoComponent } from '../../logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeSection: string = '';
  private observer!: IntersectionObserver;
  isMenuOpen = false;
  currentLang = this.translate.currentLang || 'de';

  constructor(private translate: TranslateService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigate(event: Event, id: string) {
    this.scrollToSection(event, id);
    this.isMenuOpen = false;
  }
  ngOnInit(): void {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'contact'];
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
            break;
          }
        }
      },
      { threshold: 0.6 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  scrollToSection(event: Event, id: string): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
