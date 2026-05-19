import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-volunteerregistraton',
  templateUrl: './volunteerregistraton.component.html',
  styleUrl: './volunteerregistraton.component.css'
})
export class VolunteerregistratonComponent implements OnInit {
  registrations: any[] = [];
  loading = true;
  showDetailsModal = false;
  selectedReg: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMyRegistrations();
  }

  viewDetails(reg: any) {
    this.selectedReg = reg;
    this.showDetailsModal = true;
  }

  closeDetails() {
    this.showDetailsModal = false;
    this.selectedReg = null;
  }

  cancelRegistration(regId: string) {
    if (confirm('Are you sure you want to cancel this volunteer application?')) {
      this.http.patch(`http://localhost:4300/registrations/cancel/${regId}`, {}).subscribe({
        next: (res: any) => {
          this.closeDetails();
          this.fetchMyRegistrations();
        },
        error: (err) => console.error(err)
      });
    }
  }

  fetchMyRegistrations() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.loading = true;
    this.http.get<any>(`http://localhost:4300/registrations/user/${userId}`).subscribe({
      next: (res) => {
        // Filter for volunteer registrations only
        this.registrations = (res.registrations || []).filter((r: any) => r.registrationType === 'VOLUNTEER');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    return 'status-' + status.toLowerCase();
  }
}
