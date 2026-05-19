import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isAdminRoute = false;
  isVolunteerRoute = false;
  userRole: string | null = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.userRole = localStorage.getItem('role');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.checkRoute(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects);
    });
  }

  checkRoute(url: string) {
    this.isAdminRoute = url.startsWith('/admin');
    this.isVolunteerRoute = url.startsWith('/volunteer');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
