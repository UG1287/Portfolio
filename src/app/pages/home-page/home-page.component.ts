import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';

/**
 * HomePageComponent
 *
 * Acts as the main landing page of the application.
 * Composes multiple standalone sections (About, Skills, Projects, Contact)
 * and initializes scroll animations (AOS) after the view is rendered.
 *
 * Ensures DOM-related logic only runs in the browser to maintain
 * server-side rendering (SSR) compatibility.
 */
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
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit {
  /**
   * Creates an instance of HomePageComponent.
   * @param platformId Angular's platform identifier for runtime environment checks.
   * @param doc The global Document object for safe DOM access and scrolling.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  /**
   * Lifecycle hook executed after the component's view has been initialized.
   * Dynamically imports and initializes the AOS (Animate On Scroll) library
   * for fade and scroll animations. Runs only in browser environments.
   */
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      (async () => {
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 800,
          easing: 'ease-out',
          once: true,
          offset: 60,
        });
        requestAnimationFrame(() => AOS.refresh());
      })();
    }
  }

  /**
   * Smoothly scrolls to a specific section within the home page.
   * Prevents default anchor behavior and executes only in the browser.
   *
   * @param event - The click event from a navigation link or button.
   * @param sectionId - The ID of the target section element to scroll to.
   */
  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.doc.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
