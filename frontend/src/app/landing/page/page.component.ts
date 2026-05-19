import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})
export class PageComponent {

   contactForm!: FormGroup;
  statusMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  sendMessage() {
    if (this.contactForm.invalid) {
      this.statusMessage = 'Please fill all fields correctly';
      setTimeout(() => this.statusMessage = '', 3000);
      return;
    }

    this.http.post<any>('http://localhost:4300/contact', this.contactForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.statusMessage = res.message;
          this.contactForm.reset();
          setTimeout(() => this.statusMessage = '', 5000);
        }
      },
      error: (err: any) => {
        this.statusMessage = 'Failed to send message. Please try again.';
        setTimeout(() => this.statusMessage = '', 5000);
      }
    });
  }
}
