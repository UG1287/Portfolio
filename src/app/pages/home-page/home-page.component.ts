import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    NgOptimizedImage
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamischer Import nur im Browser -> kein SSR/Prerender-Fehler, keine CJS-Warnung
      (async () => {
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 800,
          easing: 'ease-out',
          once: true,
          offset: 60
        });
        // initial sofort animieren
        requestAnimationFrame(() => AOS.refresh());
      })();
    }
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    const el = this.doc.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
