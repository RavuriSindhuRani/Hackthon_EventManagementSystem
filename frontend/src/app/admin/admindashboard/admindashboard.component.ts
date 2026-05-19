import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent implements OnInit {
  
  stats = {
    totalEvents: 0,
    totalRegistrations: 0,
    attendanceMarked: 0,
    volunteerHours: 0,
    studentsImpacted: 0
  };

  recentEvents: any[] = [];
  recentRegistrations: any[] = [];
  registrationsOverview: any = {
    students: { PENDING: 0, APPROVED: 0, REJECTED: 0, Total: 0 },
    volunteers: { PENDING: 0, APPROVED: 0, REJECTED: 0, Total: 0 }
  };

  selectedTab: 'students' | 'volunteers' = 'students';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any>('http://localhost:4300/reports/admin-stats', { headers }).subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data.stats;
          this.recentEvents = res.data.recentEvents;
          this.recentRegistrations = res.data.recentRegistrations;
          this.registrationsOverview = res.data.registrationsOverview;
        }
      },
      error: (err) => console.error('Error fetching dashboard stats:', err)
    });
  }

  get currentRegOverview() {
    return this.selectedTab === 'students' ? this.registrationsOverview.students : this.registrationsOverview.volunteers;
  }
}
