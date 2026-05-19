import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-volunteerprofile',
  templateUrl: './volunteerprofile.component.html',
  styleUrl: './volunteerprofile.component.css'
})
export class VolunteerprofileComponent implements OnInit {
  user: any = null;
  loading = true;
  isEditing = false;
  
  skills = ['Event Management', 'Public Speaking', 'Team Leadership', 'Technical Support', 'Community Outreach'];

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
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateProfile() {
    const userId = localStorage.getItem('userId');
    this.http.patch(`http://localhost:4300/auth/profile/${userId}`, this.user).subscribe({
      next: (res) => {
        alert('Profile updated successfully!');
        this.isEditing = false;
      },
      error: (err) => alert('Failed to update profile.')
    });
  }
}
