import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-volunteerstudent',
  templateUrl: './volunteerstudent.component.html',
  styleUrl: './volunteerstudent.component.css'
})
export class VolunteerstudentComponent implements OnInit {
  volunteerEvents: any[] = [];
  selectedEvent: any = null;
  registeredStudents: any[] = [];
  isLoading = false;
  isMarking = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVolunteerEvents();
  }

  fetchVolunteerEvents(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.isLoading = true;
    this.http.get<any>(`http://localhost:4300/registrations/user/${userId}`).subscribe({
      next: (res) => {
        // Filter for approved volunteer roles
        this.volunteerEvents = (res.registrations || [])
          .filter((reg: any) => reg.registrationType === 'VOLUNTEER' && reg.status === 'APPROVED')
          .map((reg: any) => reg.eventId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSelectEvent(event: any): void {
    this.selectedEvent = event;
    this.fetchStudents(event._id);
  }

  fetchStudents(eventId: string): void {
    this.isLoading = true;
    this.http.get<any>(`http://localhost:4300/registrations/studentsRegistered/${eventId}`).subscribe({
      next: (res) => {
        this.registeredStudents = res.students || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  markAttendance(studentReg: any): void {
    if (studentReg.attendanceMarked) return;

    const volunteerId = localStorage.getItem('userId');
    const payload = {
      eventId: this.selectedEvent._id,
      userId: studentReg.userId._id,
      registrationId: studentReg._id,
      verifiedBy: volunteerId,
      notes: 'Marked manually by volunteer'
    };

    this.isMarking = true;
    this.http.post<any>('http://localhost:4300/attendance/manual', payload).subscribe({
      next: (res) => {
        if (res.success) {
          studentReg.attendanceMarked = true;
        }
        this.isMarking = false;
      },
      error: (err) => {
        console.error(err);
        this.isMarking = false;
        alert('Failed to mark attendance. Please try again.');
      }
    });
  }

  goBack(): void {
    this.selectedEvent = null;
    this.registeredStudents = [];
  }
}
