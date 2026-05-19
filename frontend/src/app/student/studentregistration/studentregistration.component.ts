import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-studentregistration',
  templateUrl: './studentregistration.component.html',
  styleUrl: './studentregistration.component.css'
})
export class StudentregistrationComponent implements OnInit {
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
    if (confirm('Are you sure you want to cancel this registration?')) {
      this.http.patch(`http://localhost:4300/registrations/cancel/${regId}`, {}).subscribe({
        next: (res: any) => {
          alert('Registration cancelled successfully.');
          this.closeDetails();
          this.fetchMyRegistrations();
        },
        error: (err) => console.error(err)
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'PENDING': return 'status-pending';
      case 'REJECTED': return 'status-rejected';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  fetchMyRegistrations() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.loading = true;
    this.http.get<any>(`http://localhost:4300/registrations/user/${userId}`).subscribe({
      next: (res) => {
        this.registrations = res.registrations;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
