import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatenschutzComponent implements OnDestroy {
  privacyHtml: SafeHtml = '';
  private sub = new Subscription();

  constructor(private translate: TranslateService, private sanitizer: DomSanitizer) {
    this.sub.add(
      this.translate.stream('PRIVACY_HTML').subscribe((res: string) => {
        this.privacyHtml = this.sanitizer.bypassSecurityTrustHtml(res || '');
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}