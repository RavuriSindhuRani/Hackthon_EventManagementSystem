import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-volunteerdashboard',
  templateUrl: './volunteerdashboard.component.html',
  styleUrl: './volunteerdashboard.component.css'
})
export class VolunteerdashboardComponent implements OnInit {

  userName = 'Volunteer';
  isLoading = true;

  stats = {
    totalHours: 0,
    pendingHours: 0,
    eventsJoined: 0
  };

  upcomingOpportunities: any[] = [];
  recentActivity: any[] = [];
  
  showDetailsModal = false;
  selectedEvent: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchProfile();
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

  fetchDashboardData() {
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    if (!userId) return;

    this.http.get<any>(`http://localhost:4300/reports/volunteer-stats/${userId}`, { headers }).subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data.stats;
          this.upcomingOpportunities = res.data.upcomingOpportunities;
          this.recentActivity = res.data.recentActivity;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching volunteer dashboard stats:', err);
        this.isLoading = false;
      }
    });
  }
}
