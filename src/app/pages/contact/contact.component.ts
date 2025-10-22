// unchanged logic – just one convenience getter and sending guard kept
// (paste over your file if you want; or keep your existing one)

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
    honeypot: [''],
  });

  submitted = false;
  sending = false;
  errorMessage = '';

  mailTest = false;

  post = {
    endPoint: '/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text' as const,
    },
  };

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.sending || this.contactForm.invalid) return;
    if (this.contactForm.value.honeypot) return; // bot

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
          },
          error: () => {
            this.errorMessage = 'MESSAGE_ERROR';
            this.sending = false;
          },
        });
    } else {
      // test mode (no network)
      this.submitted = true;
      this.contactForm.reset();
      this.sending = false;
    }
  }
}
