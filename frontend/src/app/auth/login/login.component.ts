import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>('http://localhost:4300/auth/login', this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'Login Successfull') {
          // Store user info
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('role', res.role);

          // Redirect based on role
          if (res.role === 'ADMIN' || res.role === 'ORGANIZER') {
            this.router.navigate(['/admin/dashboard']);
          } else if (res.role === 'VOLUNTEER') {
            this.router.navigate(['/volunteer/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.errorMessage = res.status;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred during login. Please try again.';
        console.error(err);
      }
    });
  }
}
