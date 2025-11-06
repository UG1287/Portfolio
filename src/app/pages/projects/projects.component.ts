import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
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
