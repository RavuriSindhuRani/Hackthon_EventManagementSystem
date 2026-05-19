import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-adminevets',
  templateUrl: './adminevets.component.html',
  styleUrl: './adminevets.component.css'
})
export class AdminevetsComponent implements OnInit {

  events: any[] = [];
  loading = true;
  isAddMode: boolean = false;
  eventForm: FormGroup;
  
  categories: string[] = ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'COMMUNITY', 'SOCIAL', 'CULTURAL', 'SPORTS', 'TECHNICAL', 'HACKATHON', 'BOOTCAMP', 'NETWORKING', 'MOCK_INTERVIEW', 'MENTORING'];

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private http: HttpClient
  ) {

    this.eventForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      category: new FormControl('WORKSHOP', [Validators.required]),
      mode: new FormControl('', [Validators.required]),
      venue: new FormControl(''),
      meetingLink: new FormControl(''),
      startDateTime: new FormControl('', [Validators.required]),
      endDateTime: new FormControl('', [Validators.required]),
      capacity: new FormControl(null, [Validators.required, Validators.min(1)]),
      volunteerRequiredCount: new FormControl(0, [Validators.min(0)])
    });
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  saveEvent() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Your session has expired. Please log in again.');
      return;
    }

    const eventData = {
      ...this.eventForm.value,
      organizerId: userId
    };

    this.eventService.createEvent(eventData).subscribe({
      next: (res: any) => {
        alert('Event Created Successfully');
        this.fetchEvents();
        this.eventForm.reset({ category: 'WORKSHOP' });
        this.isAddMode = false;
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to create event. Please try again.');
      }
    });
  }

  fetchEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (res: any) => {
        this.events = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  publishEvent(event: any) {
    this.eventService.publishEvent(event._id).subscribe({
      next: () => {
        alert('Event Published Successfully');
        this.fetchEvents();
      },
      error: (err: any) => console.log(err)
    });
  }

  deleteEvent(event: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(event._id).subscribe({
        next: () => {
          alert('Event Deleted Successfully');
          this.fetchEvents();
        },
        error: (err: any) => console.log(err)
      });
    }
  }

  cancelEvent(event: any) {
    if (confirm('Are you sure you want to cancel this event?')) {
      this.eventService.cancelEvent(event._id).subscribe({
        next: () => {
          alert('Event Cancelled Successfully');
          this.fetchEvents();
        },
        error: (err: any) => console.log(err)
      });
    }
  }

  // ================== REGISTRATION MANAGEMENT ==================
  isRegistrationsMode: boolean = false;
  selectedEvent: any = null;
  
  eventStudents: any[] = [];
  eventVolunteers: any[] = [];
  loadingRegs: boolean = false;

  viewRegistrations(event: any) {
    this.selectedEvent = event;
    this.isRegistrationsMode = true;
    this.isAddMode = false;
    this.fetchEventRegistrations();
  }

  closeRegistrations() {
    this.isRegistrationsMode = false;
    this.selectedEvent = null;
    this.eventStudents = [];
    this.eventVolunteers = [];
  }

  fetchEventRegistrations() {
    if(!this.selectedEvent) return;
    this.loadingRegs = true;
    const eventId = this.selectedEvent._id;

    this.http.get<any>(`http://localhost:4300/registrations/studentsRegistered/${eventId}`).subscribe({
      next: (res: any) => {
        this.eventStudents = res.students || [];
        
        this.http.get<any>(`http://localhost:4300/registrations/volunteerRegistered/${eventId}`).subscribe({
          next: (resVol: any) => {
            this.eventVolunteers = resVol.volunteer || [];
            this.loadingRegs = false;
          },
          error: (err: any) => { console.log(err); this.loadingRegs = false; }
        });
      },
      error: (err: any) => {
        console.log(err);
        this.loadingRegs = false;
      }
    });
  }

  approveRegistration(regId: string, type: 'STUDENT' | 'VOLUNTEER') {
    this.http.patch(`http://localhost:4300/registrations/approve/${regId}`, {}).subscribe({
      next: () => {
        this.updateRegStatusLocally(regId, type, 'APPROVED');
      },
      error: (err: any) => console.log(err)
    });
  }

  rejectRegistration(regId: string, type: 'STUDENT' | 'VOLUNTEER') {
    this.http.patch(`http://localhost:4300/registrations/reject/${regId}`, {}).subscribe({
      next: () => {
        this.updateRegStatusLocally(regId, type, 'REJECTED');
      },
      error: (err: any) => console.log(err)
    });
  }

  updateRegStatusLocally(regId: string, type: 'STUDENT' | 'VOLUNTEER', status: string) {
    if (type === 'STUDENT') {
      const idx = this.eventStudents.findIndex((r: any) => r._id === regId);
      if (idx !== -1) this.eventStudents[idx].status = status;
    } else {
      const idx = this.eventVolunteers.findIndex((r: any) => r._id === regId);
      if (idx !== -1) this.eventVolunteers[idx].status = status;
    }
  }

}