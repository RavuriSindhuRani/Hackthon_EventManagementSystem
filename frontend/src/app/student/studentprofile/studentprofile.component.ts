import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.css'
})
export class StudentprofileComponent implements OnInit {
  student: any = null;
  loading = true;
  isEditMode = false;
  editData: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.loading = true;
    this.http.get<any>(`http://localhost:4300/auth/profile/${userId}`).subscribe({
      next: (res) => {
        this.student = res;
        this.editData = { ...res };
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editData = { ...this.student };
    }
  }

  updateProfile() {
    const userId = localStorage.getItem('userId');
    this.http.patch(`http://localhost:4300/auth/profile/${userId}`, this.editData).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Profile updated successfully!');
          this.student = res.user;
          this.isEditMode = false;
        }
      },
      error: (err) => console.error(err)
    });
  }
}
