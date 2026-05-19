import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-volunteermyhours',
  templateUrl: './volunteermyhours.component.html',
  styleUrl: './volunteermyhours.component.css'
})
export class VolunteermyhoursComponent implements OnInit {
  hourRecords: any[] = [];
  loading = true;
  showLogModal = false;
  isSubmitting = false;

  approvedEvents: any[] = [];
  
  newEntry = {
    eventId: '',
    hoursContributed: 0,
    description: ''
  };

  stats = {
    total: 0,
    pending: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMyHours();
    this.fetchApprovedEvents();
  }

  fetchMyHours() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.loading = true;
    this.http.get<any[]>(`http://localhost:4300/volunteer-hours/user/${userId}`).subscribe({
      next: (res) => {
        this.hourRecords = res || [];
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  fetchApprovedEvents() {
    const userId = localStorage.getItem('userId');
    this.http.get<any>(`http://localhost:4300/registrations/user/${userId}`).subscribe({
      next: (res) => {
        // Only allow logging hours for events where they were APPROVED as a VOLUNTEER
        this.approvedEvents = (res.registrations || [])
          .filter((r: any) => r.registrationType === 'VOLUNTEER' && r.status === 'APPROVED')
          .map((r: any) => r.eventId);
      }
    });
  }

  calculateStats() {
    this.stats.total = this.hourRecords
      .filter(r => r.status === 'APPROVED')
      .reduce((sum, r) => sum + r.hoursContributed, 0);
    
    this.stats.pending = this.hourRecords
      .filter(r => r.status === 'PENDING')
      .reduce((sum, r) => sum + r.hoursContributed, 0);
  }

  openLogModal() {
    this.showLogModal = true;
  }

  closeLogModal() {
    this.showLogModal = false;
    this.newEntry = { eventId: '', hoursContributed: 0, description: '' };
  }

  submitHours() {
    const userId = localStorage.getItem('userId');
    if (!this.newEntry.eventId || this.newEntry.hoursContributed <= 0) {
      alert('Please select an event and enter valid hours.');
      return;
    }

    this.isSubmitting = true;
    const payload = {
      volunteerId: userId,
      ...this.newEntry
    };

    this.http.post('http://localhost:4300/volunteer-hours/', payload).subscribe({
      next: (res) => {
        alert('Hours submitted for approval!');
        this.isSubmitting = false;
        this.closeLogModal();
        this.fetchMyHours();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Failed to submit hours.');
      }
    });
  }
}
