import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-studentattendance',
  templateUrl: './studentattendance.component.html',
  styleUrl: './studentattendance.component.css'
})
export class StudentattendanceComponent implements OnInit {
  attendanceRecords: any[] = [];
  loading = true;
  stats = {
    attended: 0,
    pending: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMyAttendance();
    this.fetchAttendanceStats();
  }

  fetchAttendanceStats() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.get<any>(`http://localhost:4300/reports/student-stats/${userId}`).subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.attended = res.data.stats.attendedEvents;
          this.stats.pending = res.data.stats.pendingEvents;
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
        this.attendanceRecords = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
