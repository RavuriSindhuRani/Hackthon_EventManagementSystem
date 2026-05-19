import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminattendance',
  templateUrl: './adminattendance.component.html',
  styleUrl: './adminattendance.component.css'
})
export class AdminattendanceComponent implements OnInit {

  events: any[] = [];
  selectedEvent: any = null;
  registrations: any[] = [];
  attendanceRecords: any[] = [];
  loading = false;
  searchTerm = '';

  stats = {
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.http.get<any[]>('http://localhost:4300/events/').subscribe({
      next: (res) => this.events = res,
      error: (err) => console.error(err)
    });
  }

  onEventChange(event: any) {
    const eventId = event.target.value;
    this.selectedEvent = this.events.find(e => e._id === eventId);
    if (this.selectedEvent) {
      this.fetchAttendanceData(eventId);
    }
  }

  fetchAttendanceData(eventId: string) {
    this.loading = true;
    this.http.get<any>(`http://localhost:4300/registrations/event/${eventId}`).subscribe({
      next: (res) => {
        this.registrations = res.registrations;
        
        this.http.get<any>(`http://localhost:4300/attendance/event/${eventId}`).subscribe({
          next: (attRes) => {
            this.attendanceRecords = attRes.attendance;
            this.mergeAttendance();
            this.calculateStats();
            this.loading = false;
          },
          error: (err) => { console.error(err); this.loading = false; }
        });
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  mergeAttendance() {
    this.registrations.forEach(reg => {
      const record = this.attendanceRecords.find(a => a.registrationId?._id === reg._id);
      reg.attendance = record || null;
      reg.isPresent = !!record;
    });
  }

  calculateStats() {
    this.stats.total = this.registrations.length;
    this.stats.present = this.registrations.filter(r => r.isPresent).length;
    this.stats.absent = this.stats.total - this.stats.present;
    this.stats.percentage = this.stats.total > 0 ? Math.round((this.stats.present / this.stats.total) * 100) : 0;
  }

  markAttendance(reg: any) {
    const body = {
      eventId: reg.eventId._id,
      userId: reg.userId._id,
      registrationId: reg._id,
      attendanceMethod: 'MANUAL',
      verifiedBy: localStorage.getItem('userId')
    };

    this.http.post('http://localhost:4300/attendance/manual', body).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.fetchAttendanceData(this.selectedEvent._id);
        }
      },
      error: (err) => console.error(err)
    });
  }

  get filteredRegistrations() {
    return this.registrations.filter(r => 
      r.userId?.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.userId?.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
