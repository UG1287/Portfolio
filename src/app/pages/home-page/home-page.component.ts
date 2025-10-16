import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';

import AOS from 'aos';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Nur im Browser (SSR-Schutz)
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,                 // animiert nur einmal (Landingpage-Feeling)
        offset: 60,
        startEvent: 'DOMContentLoaded'
      });

      // sorgt dafür, dass Elemente im initialen Viewport sofort animieren
      requestAnimationFrame(() => AOS.refresh());
    }
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
