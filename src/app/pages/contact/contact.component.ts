import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

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
    honeypot: [''], // Anti-Bot
  });

  errorMessage = '';
  successMessage = '';

  submitted = false;
  sending = false;
  mailTest = false; // auf true für Testmodus ohne Mailversand

  post = {
    endPoint: 'https://www.deine-domain.de/sendMail.php', // deine Domain
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
      },
      responseType: 'text' as const,
    },
  };

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      // Bot-Feld nicht leer? = Spam
      if (this.contactForm.value.honeypot) {
        console.warn('Bot-Versuch erkannt');
        return;
      }

      const payload = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message,
      };

      this.sending = true;

      if (!this.mailTest) {
        this.http
          .post(this.post.endPoint, this.post.body(payload), this.post.options)
          .subscribe({
            next: (response) => {
              this.submitted = true;
              this.successMessage = 'MESSAGE_SENT'; // Wird übersetzt
              this.contactForm.reset();
              this.sending = false;
            },
            error: (error) => {
              this.errorMessage = 'MESSAGE_ERROR'; // Wird übersetzt
              console.error('Mail error:', error);
              this.sending = false;
            },
            complete: () => console.info('Send complete'),
          });
      } else {
        console.info('Testmodus: Mail nicht gesendet');
        this.submitted = true;
        this.contactForm.reset();
        this.sending = false;
      }
    }
  }
}
