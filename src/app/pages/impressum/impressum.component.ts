import { CommonModule } from '@angular/common';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './impressum.component.html',
  styleUrls: ['./impressum.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImpressumComponent implements OnDestroy {
  imprintHtml: SafeHtml = '';
  private sub = new Subscription();

  constructor(private translate: TranslateService, private sanitizer: DomSanitizer) {
    this.sub.add(
      this.translate.stream('IMPRINT_HTML').subscribe((res: string) => {
        this.imprintHtml = this.sanitizer.bypassSecurityTrustHtml(res || '');
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}