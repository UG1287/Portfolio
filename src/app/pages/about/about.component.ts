import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  scrollTo(id: string, event?: Event) {
    event?.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;   // SSR-safe
    const el = this.doc.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
