import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-volunteerattendance',
  templateUrl: './volunteerattendance.component.html',
  styleUrl: './volunteerattendance.component.css'
})
export class VolunteerattendanceComponent implements OnInit {
  attendanceRecords: any[] = [];
  loading = true;
  stats = {
    attended: 0,
    pending: 0
  };
  liveEvents: any[] = [];

  private refreshInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refreshData();
    // Real-time update every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  refreshData() {
    this.fetchMyAttendance();
    this.fetchAttendanceStats();
    this.fetchLiveStatus();
  }

  fetchAttendanceStats() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.get<any>(`http://localhost:4300/registrations/user/${userId}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.attended = res.registrations.filter((r: any) => r.attendanceMarked).length;
          this.stats.pending = res.registrations.filter((r: any) => !r.attendanceMarked && r.status === 'APPROVED').length;
        }
      }
    });
  }

  fetchMyAttendance() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.loading = true;
    this.http.get<any>(`http://localhost:4300/attendance/user/${userId}`).subscribe({
      next: (res) => {
        this.attendanceRecords = res.attendance || res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  fetchLiveStatus() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Fetch user registrations and check for ongoing events
    this.http.get<any>(`http://localhost:4300/registrations/user/${userId}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.liveEvents = res.registrations.filter((r: any) => 
            r.eventId?.status === 'ONGOING' && r.status === 'APPROVED'
          );
        }
      }
    });
  }
}
