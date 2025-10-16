import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects = [
  {
    title: 'El Pollo Loco',
    image: 'assets/img/pollo-loco-preview.jpg',
    descriptionKey: 'PROJECT_POLLO_DESC',
    stack: ['JavaScript', 'HTML', 'CSS'],
    liveLink: 'https://your-subdomain.de/pollo-loco',
    repoLink: 'https://github.com/deinGithub/pollo-loco'
  },
  {
    title: 'Weather App',
    image: 'assets/img/weather-app-preview.jpg',
    descriptionKey: 'PROJECT_WEATHER_DESC',
    stack: ['Angular', 'TypeScript', 'API'],
    liveLink: 'https://your-subdomain.de/weather-app',
    repoLink: 'https://github.com/deinGithub/weather-app'
  }
];

}
