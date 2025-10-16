import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
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

  scrollTo(id: string, ev?: Event) {
    ev?.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
