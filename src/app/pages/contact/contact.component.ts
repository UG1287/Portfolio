import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

/**
 * FieldName
 *
 * Represents the available form field names for the contact form.
 */
type FieldName = 'name' | 'email' | 'message' | 'privacy';

/**
 * ContactComponent
 *
 * Provides a reactive contact form with validation, spam protection (honeypot),
 * and asynchronous submission to a backend mail handler.
 *
 * Displays validation errors temporarily and provides user feedback
 * on both success and failure states.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  /**
   * Reactive form group containing all form controls with their validators.
   */
  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    privacy: [false, [Validators.requiredTrue]],
    honeypot: [''], // Hidden spam-prevention field
  });

  /** Indicates if the form was successfully submitted. */
  submitted = false;

  /** Tracks whether a submission request is currently in progress. */
  sending = false;

  /** Stores the translation key for the current error message, if any. */
  errorMessage = '';

  /** Enables mail testing mode to bypass HTTP request logic (for development). */
  mailTest = false;

  /** Duration in milliseconds that an error message remains visible. */
  private readonly ERROR_VISIBLE_MS = 5_000;

  /** Tracks visibility timers for field-level validation errors. */
  private errorUntil: Partial<Record<FieldName, number>> = {};

  /**
   * Creates an instance of ContactComponent.
   * @param fb Angular FormBuilder for creating reactive form structures.
   * @param http Angular HttpClient for performing form submission requests.
   */
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  /**
   * Shortcut getter for direct access to form controls in the template.
   */
  get f() {
    return this.contactForm.controls;
  }

  /**
   * Marks a field as touched and triggers temporary error visibility if invalid.
   * @param field - The name of the form field to evaluate.
   */
  showErrorFor(field: FieldName): void {
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

  /**
   * Determines whether a field currently displays an error message.
   * @param field - The name of the form field.
   * @returns True if the field is invalid and within the visible error window.
   */
  isError(field: FieldName): boolean {
    const ctrl = this.contactForm.get(field);
    if (!ctrl) return false;

    const until = this.errorUntil[field] ?? 0;
    return ctrl.touched && ctrl.invalid && Date.now() < until;
  }

  /**
   * Triggers validation for all form fields, used when submitting invalid forms.
   */
  private triggerAllErrors(): void {
    (['name', 'email', 'message', 'privacy'] as FieldName[]).forEach((f) =>
      this.showErrorFor(f)
    );
  }

  /**
   * Handles the submission of the contact form.
   * Performs validation, prevents duplicate submissions,
   * and sends the form data to the backend endpoint.
   *
   * In mailTest mode, the submission is simulated locally without an HTTP call.
   */
  onSubmit(): void {
    if (this.sending) return;

    if (this.contactForm.invalid) {
      this.triggerAllErrors();
      return;
    }

    if (this.contactForm.value.honeypot) return; // Bot protection

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
            this.errorUntil = {};
          },
          error: () => {
            this.errorMessage = 'MESSAGE_ERROR';
            this.sending = false;
          },
        });
    } else {
      // Simulated success for testing
      this.submitted = true;
      this.contactForm.reset();
      this.sending = false;
      this.errorUntil = {};
    }
  }

  /**
   * Defines configuration for the HTTP POST request used in form submission.
   */
  post = {
    /** The endpoint to which the form data will be sent. */
    endPoint: '/sendMail.php',
    /**
     * Serializes the payload to a JSON string.
     * @param payload - The form data object.
     */
    body: (payload: any) => JSON.stringify(payload),
    /** HTTP options including headers and response type. */
    options: {
      headers: { 'Content-Type': 'text/plain' },
      responseType: 'text' as const,
    },
  };
}
