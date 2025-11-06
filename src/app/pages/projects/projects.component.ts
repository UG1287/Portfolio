import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * ProjectsComponent
 *
 * Displays a list of featured projects with images, technology stacks,
 * and links to live demos and GitHub repositories.  
 * Uses translation keys for project descriptions to support internationalization.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  /**
   * A collection of personal or portfolio projects to showcase in the UI.
   * Each project contains metadata for title, image, description, tech stack,
   * and external links to the live version and repository.
   */
  projects = [
    {
      title: 'El Pollo Loco',
      image: 'assets/img/Polloloco.png',
      descriptionKey: 'PROJECT_POLLO_DESC',
      stack: ['JavaScript', 'HTML', 'CSS'],
      liveLink: '/apps/elpolloloco/',
      repoLink: 'https://github.com/UG1287/El-Pollo-Loco',
    },
    {
      title: 'Join App',
      image: 'assets/img/join.png',
      descriptionKey: 'PROJECT_JOIN_DESC',
      stack: ['Angular', 'TypeScript', 'API'],
      liveLink: '/apps/join/login.html',
      repoLink: 'https://github.com/deinGithub/weather-app',
    },
  ];
}
