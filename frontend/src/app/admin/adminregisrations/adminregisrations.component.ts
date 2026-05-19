import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-adminregisrations',
  templateUrl: './adminregisrations.component.html',
  styleUrl: './adminregisrations.component.css'
})
export class AdminregisrationsComponent implements OnInit {

  events: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEventsWithStats();
  }

  fetchEventsWithStats() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:4300/events/').subscribe({
      next: (events) => {
        this.events = events;
        this.loadStatsForEvents();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadStatsForEvents() {
    let completed = 0;
    if (this.events.length === 0) {
      this.loading = false;
      return;
    }

    this.events.forEach(event => {
      this.http.get<any>(`http://localhost:4300/registrations/event-stats/${event._id}`).subscribe({
        next: (res) => {
          if (res.success) {
            event.stats = this.processStats(res.stats);
          }
          completed++;
          if (completed === this.events.length) this.loading = false;
        },
        error: (err) => {
          console.error(err);
          completed++;
          if (completed === this.events.length) this.loading = false;
        }
      });
    });
  }

  processStats(stats: any[]) {
    const defaultStat = { total: 0, approved: 0, rejected: 0, pending: 0 };
    const result = {
      STUDENT: { ...defaultStat },
      VOLUNTEER: { ...defaultStat }
    };

    stats.forEach(s => {
      if (s._id === 'STUDENT') result.STUDENT = s;
      if (s._id === 'VOLUNTEER') result.VOLUNTEER = s;
    });

    return result;
  }

  bulkApprove(eventId: string, type: 'STUDENT' | 'VOLUNTEER') {
    if (confirm(`Are you sure you want to approve all pending ${type.toLowerCase()}s for this event?`)) {
      this.http.patch(`http://localhost:4300/registrations/bulk-approve/${eventId}/${type}`, {}).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.fetchEventsWithStats(); // Refresh
        },
        error: (err) => console.error(err)
      });
    }
  }

  exportToCSV(event: any) {
    this.http.get<any>(`http://localhost:4300/registrations/all`).subscribe({
      next: (res) => {
        const filtered = res.registrations.filter((r: any) => r.eventId?._id === event._id);
        if (filtered.length === 0) {
          alert('No registrations to export.');
          return;
        }

        const csvData = this.convertToCSV(filtered);
        this.downloadCSV(csvData, `registrations_${event.title.replace(/\s+/g, '_')}.csv`);
      }
    });
  }

  private convertToCSV(data: any[]) {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Applied At'];
    const rows = data.map(r => [
      `${r.userId?.firstName} ${r.userId?.lastName}`,
      r.userId?.email,
      r.registrationType,
      r.status,
      new Date(r.appliedAt).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private downloadCSV(csvContent: string, fileName: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
