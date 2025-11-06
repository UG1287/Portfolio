import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

type FieldName = 'name' | 'email' | 'message' | 'privacy';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    privacy: [false, [Validators.requiredTrue]],
    honeypot: [''],
  });

  submitted = false;
  sending = false;
  errorMessage = '';

  mailTest = false;

  // Timer-Logik für Fehleranzeigen (wie bei dir: 5s)
  private readonly ERROR_VISIBLE_MS = 5_000;
  private errorUntil: Partial<Record<FieldName, number>> = {};


  constructor(private fb: FormBuilder, private http: HttpClient) {}

  get f() {
    return this.contactForm.controls;
  }

  // Aufruf im Template z.B. (blur)="showErrorFor('name')", (change)="showErrorFor('privacy')"
  showErrorFor(field: FieldName) {
    const ctrl = this.contactForm.get(field);
    if (!ctrl) return;

    ctrl.markAsTouched();

    if (ctrl.invalid) {
      const until = Date.now() + this.ERROR_VISIBLE_MS;
      this.errorUntil[field] = until;

      setTimeout(() => {
        if (this.errorUntil[field] === until) {
          delete this.errorUntil[field];
        }
      }, this.ERROR_VISIBLE_MS);
    } else {
      delete this.errorUntil[field];
    }
  }

  // Für [class.has-error]="isError('name')" etc.
  isError(field: FieldName): boolean {
    const ctrl = this.contactForm.get(field);
    if (!ctrl) return false;

    const until = this.errorUntil[field] ?? 0;
    return ctrl.touched && ctrl.invalid && Date.now() < until;
  }

  // Optional: alle Fehlermeldungen gleichzeitig anzeigen (und nach 5s ausblenden)
  private triggerAllErrors() {
    (['name', 'email', 'message', 'privacy'] as FieldName[]).forEach((f) =>
      this.showErrorFor(f)
    );
  }

  onSubmit() {
    if (this.sending) return;

    if (this.contactForm.invalid) {
      this.triggerAllErrors();
      return;
    }
    if (this.contactForm.value.honeypot) return;

    const payload = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      message: this.contactForm.value.message,
    };

    this.sending = true;
    this.errorMessage = '';

    if (!this.mailTest) {
      this.http
        .post(this.post.endPoint, this.post.body(payload), this.post.options)
        .subscribe({
          next: () => {
            this.submitted = true;
            this.contactForm.reset();
            this.sending = false;
            this.errorUntil = {}; // evtl. noch sichtbare Timer zurücksetzen
          },
          error: () => {
            this.errorMessage = 'MESSAGE_ERROR';
            this.sending = false;
          },
        });
    } else {
      // Testmodus (ohne Netzwerk)
      this.submitted = true;
      this.contactForm.reset();
      this.sending = false;
      this.errorUntil = {};
    }
  }

  // deine Mail-Einstellungen
  post = {
    endPoint: '/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text' as const,
    },
  };
}
