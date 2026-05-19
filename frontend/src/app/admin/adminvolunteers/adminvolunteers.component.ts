import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminvolunteers',
  templateUrl: './adminvolunteers.component.html',
  styleUrl: './adminvolunteers.component.css'
})
export class AdminvolunteersComponent implements OnInit {

  pendingHours: any[] = [];
  volunteers: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:4300/volunteer-hours/pending').subscribe({
      next: (res) => {
        this.pendingHours = res;
        this.fetchVolunteers();
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  fetchVolunteers() {
    this.http.get<any[]>('http://localhost:4300/auth/volunteers').subscribe({
      next: (res) => {
        this.volunteers = res.sort((a, b) => (b.totalVolunteerHours || 0) - (a.totalVolunteerHours || 0));
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  approveHours(id: string) {
    this.http.patch(`http://localhost:4300/volunteer-hours/approve/${id}`, {}).subscribe({
      next: () => {
        alert('Hours Approved');
        this.fetchData();
      },
      error: (err) => console.error(err)
    });
  }

  rejectHours(id: string) {
    if (confirm('Are you sure you want to reject these hours?')) {
      this.http.patch(`http://localhost:4300/volunteer-hours/reject/${id}`, {}).subscribe({
        next: () => {
          alert('Hours Rejected');
          this.fetchData();
        },
        error: (err) => console.error(err)
      });
    }
  }
}
