import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-faceattendance',
  templateUrl: './faceattendance.component.html',
  styleUrl: './faceattendance.component.css'
})
export class FaceattendanceComponent implements OnInit {

  events: any[] = [];
  selectedEventId: string = 'AUTO_DETECT';
  
  // Webcam properties
  showScanner = true;
  private trigger: Subject<void> = new Subject<void>();
  
  recognizedUser: any = null;
  scannedEventTitle: string = '';
  attendanceMarked: boolean = false;
  message: string = '';
  isProcessing = false;
  previewImage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents() {
    this.http.get<any[]>('http://localhost:4300/events/').subscribe({
      next: (res) => {
        this.events = res.filter(e => e.published);
      },
      error: (err) => console.error(err)
    });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  captureFace() {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    if (!this.selectedEventId) {
      alert('Please select an event first');
      return;
    }
    
    this.isProcessing = true;
    this.message = 'Scanning face...';
    this.previewImage = webcamImage.imageAsDataUrl;
    
    const blob = this.dataURItoBlob(webcamImage.imageAsDataUrl);
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');
    formData.append('eventId', this.selectedEventId);

    this.http.post('http://localhost:4300/attendance/', formData).subscribe({
      next: (res: any) => {
        console.log('Face Recognition Response:', res);
        this.isProcessing = false;
        
        if (res.success && res.user) {
          this.recognizedUser = res.user;
          this.scannedEventTitle = res.eventTitle;
          this.attendanceMarked = res.attendanceMarked;
          this.message = res.message;
        } else {
          this.message = res.message || 'Face Not Recognized';
          this.recognizedUser = null;
          // If the backend says success but user is missing, it's a data error
          if (res.success && !res.user) {
             this.message = "System Error: User profile missing for this registration.";
          }
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.message = 'Network error during recognition';
        console.error(err);
      }
    });
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

  reset() {
    this.recognizedUser = null;
    this.scannedEventTitle = '';
    this.message = '';
    this.previewImage = '';
    this.showScanner = true;
  }
}
