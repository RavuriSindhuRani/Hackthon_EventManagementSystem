import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventsService } from '../../services/events.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-studentevent',
  templateUrl: './studentevent.component.html',
  styleUrl: './studentevent.component.css'
})
export class StudenteventComponent implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];
  
  loading = true;
  searchTerm = '';
  categoryFilter = 'ALL';

  toastMessage = '';
  toastType = ''; // 'success' or 'error'

  // Modal & Webcam variables
  showRegistrationModal = false;
  showDetailsModal = false;
  showResultPopup = false;
  regStatus: 'SUCCESS' | 'ERROR' | '' = '';
  
  selectedEventId = '';
  selectedEvent: any = null;
  isRegistering = false;
  
  webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();

  constructor(private eventService: EventsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (res: any) => {
        // Show all published events that are not drafts, cancelled or completed
        this.events = (res || []).filter((e: any) => 
          e.published === true && 
          e.status !== 'DRAFT' && 
          e.status !== 'CANCELLED' &&
          e.status !== 'COMPLETED'
        );
        this.filterEvents();
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.showToast('Failed to load events', 'error');
        this.loading = false;
      }
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesCategory = this.categoryFilter === 'ALL' || event.category === this.categoryFilter;
      const matchesSearch = event.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            event.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  openRegistrationModal(eventId: string, capacity: number = 999, registeredCount: number = 0): void {
    if (registeredCount >= capacity) {
      this.showToast('Event is at full capacity.', 'error');
      return;
    }
    
    this.selectedEventId = eventId;
    this.webcamImage = null; // reset previous capture
    this.showRegistrationModal = true;
  }

  closeModal(): void {
    this.showRegistrationModal = false;
    this.selectedEventId = '';
    this.webcamImage = null;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  capture(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  viewDetails(event: any): void {
    this.selectedEvent = event;
    this.showDetailsModal = true;
  }

  closeDetails(): void {
    this.showDetailsModal = false;
    this.selectedEvent = null;
  }

  registerStudent(): void {
    if (!this.webcamImage) {
      this.showToast('Please capture your photo for attendance.', 'error');
      return;
    }

    this.isRegistering = true;
    const blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
    const formData = new FormData();
    const userId = localStorage.getItem('userId') || '';
    const role = localStorage.getItem('role') || 'STUDENT';

    formData.append('eventId', this.selectedEventId);
    formData.append('userId', userId);
    formData.append('registrationType', role);
    formData.append('image', blob, 'face.jpg');

    this.http.post('http://localhost:4300/registrations/', formData).subscribe({
      next: (res: any) => {
        this.isRegistering = false;
        this.regStatus = 'SUCCESS';
        this.showResultPopup = true;
        this.closeModal();
        this.fetchEvents(); 
      },
      error: (err: any) => {
        this.isRegistering = false;
        this.regStatus = 'ERROR';
        this.toastMessage = err.error?.message || 'Failed to register';
        this.showResultPopup = true;
        console.log(err);
      }
    });
  }

  closeResultPopup(): void {
    this.showResultPopup = false;
    this.regStatus = '';
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }
}

