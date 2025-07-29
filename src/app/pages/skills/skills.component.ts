import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  skills = [
    { name: 'HTML', icon: 'assets/icons/html5.svg' },
    { name: 'CSS', icon: 'assets/icons/css3.svg' },
    { name: 'JavaScript', icon: 'assets/icons/javascript.svg' },
    { name: 'Angular', icon: 'assets/icons/angular.svg' },
    { name: 'Python', icon: 'assets/icons/python.svg' },
    { name: 'Django', icon: 'assets/icons/django.svg' },
    { name: 'Git', icon: 'assets/icons/git.svg' },
    { name: 'Responsive Design', icon: 'assets/icons/responsive.svg' }
  ];
}
