import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styleUrl: './adminprofile.component.css'
})
export class AdminprofileComponent implements OnInit {

  admin: any = null;
  loading = true;
  stats = {
    eventsCreated: 0,
    totalApprovals: 0,
    daysActive: 0
  };

  isEditMode = false;
  editData: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.get<any>(`http://localhost:4300/auth/profile/${userId}`).subscribe({
      next: (res) => {
        this.admin = res;
        this.editData = { ...res };
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  calculateStats() {
    this.stats.eventsCreated = 12;
    this.stats.totalApprovals = 145;
    this.stats.daysActive = 45;
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editData = { ...this.admin };
    }
  }

  updateProfile() {
    const userId = localStorage.getItem('userId');
    this.http.patch(`http://localhost:4300/auth/profile/${userId}`, this.editData).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Profile updated successfully!');
          this.admin = res.user;
          this.isEditMode = false;
        }
      },
      error: (err) => console.error(err)
    });
  }
}
