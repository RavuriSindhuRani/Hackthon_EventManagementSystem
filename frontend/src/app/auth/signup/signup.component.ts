import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STUDENT'
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post<any>('http://localhost:4300/auth/registration', this.signupData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'Registration successful') {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = res.status || 'Registration failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred during registration. Please try again.';
        console.error(err);
      }
    });
  }
}
