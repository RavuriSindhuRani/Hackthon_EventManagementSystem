import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userName = 'Student';
  isLoading = true;
  impactProgress = 65; // Best Feature: Impact Progress

  stats = {
    registeredEvents: 0,
    attendedEvents: 0,
    pendingEvents: 0,
    certificatesEarned: 0
  };

  upcomingEvents: any[] = [];
  publicEvents: any[] = [];
  recentActivities: any[] = [];
  
  showDetailsModal = false;
  selectedEvent: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStudentData();
    this.fetchProfile();
    this.fetchPublicEvents();
  }

  viewDetails(event: any) {
    this.selectedEvent = event;
    this.showDetailsModal = true;
  }

  closeDetails() {
    this.showDetailsModal = false;
    this.selectedEvent = null;
  }

  fetchProfile() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any>(`http://localhost:4300/auth/profile/${userId}`).subscribe({
        next: (res) => this.userName = res.firstName,
        error: (err) => console.error(err)
      });
    }
  }

  fetchPublicEvents() {
    this.http.get<any[]>(`http://localhost:4300/events/`).subscribe({
      next: (res) => {
        this.publicEvents = (res || [])
          .filter(e => e.published && e.status !== 'COMPLETED' && e.status !== 'CANCELLED')
          .slice(0, 3);
      },
      error: (err) => console.error(err)
    });
  }

  fetchStudentData() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.isLoading = true;
    this.http.get<any>(`http://localhost:4300/reports/student-stats/${userId}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data.stats;
          this.upcomingEvents = res.data.upcomingEvents;
          this.recentActivities = res.data.recentActivity;
          this.impactProgress = Math.min(100, (this.stats.attendedEvents / 10) * 100);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
