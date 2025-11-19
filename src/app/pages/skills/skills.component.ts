import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * SkillsComponent
 *
 * Displays a list of technical and soft skills with their respective icons.
 * Supports smooth scrolling to target elements on the page and conditional
 * client-side behavior to ensure compatibility with Angular Universal (SSR).
 */
@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  /**
   * Creates an instance of SkillsComponent.
   * @param platformId Angular's platform identifier used to detect browser environment.
   * @param doc The global Document object, injected for DOM manipulation.
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  /**
   * A collection of skills with associated icon paths.
   * Includes both core technologies and an expandable learning section.
   */
  skills = [
    { name: 'HTML', icon: 'assets/icons/html.png' },
    { name: 'CSS', icon: 'assets/icons/css.png' },
    { name: 'JavaScript', icon: 'assets/icons/js.png' },
    { name: 'TypeScript', icon: 'assets/icons/ts.png' },
    { name: 'Angular', icon: 'assets/icons/angular.png' },
    { name: 'REST-API', icon: 'assets/icons/rest_api.png' },
    { name: 'Git', icon: 'assets/icons/git.png' },
    { name: 'Scrum', icon: 'assets/icons/scrum.png' },
    { name: 'Material Design', icon: 'assets/icons/material_design.png' },
    { name: 'AI', icon: 'assets/icons/ai.png' },
    {
      name: 'Continually Learning',
      icon: 'assets/icons/continually_learning.png',
      key: 'learning',
      tooltip: {
        title: 'I have a special interest in learning',
        items: [
          { name: 'React', icon: 'assets/icons/React.svg' },
          { name: 'Vue.js', icon: 'assets/icons/VueJs.svg' },
        ],
      },
    },
  ];

  /**
   * Smoothly scrolls to the element with the given ID when triggered.
   * Only executes in the browser to prevent errors in SSR environments.
   *
   * @param id - The ID of the target DOM element to scroll to.
   * @param ev - Optional event to prevent default link navigation.
   */
  scrollTo(id: string, ev?: Event): void {
    ev?.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.doc.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
