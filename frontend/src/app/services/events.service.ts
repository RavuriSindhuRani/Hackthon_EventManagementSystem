import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAllEvents() {
    return this.http.get(`${this.apiUrl}/events`);
  }

  registerForEvent(obj: any) {
    return this.http.post(`${this.apiUrl}/registrations`, obj);
  }

  createEvent(event: any) {
    return this.http.post(`${this.apiUrl}/events/addEvent`, event);
  }

  publishEvent(pid: any) {
    return this.http.patch(
      `${this.apiUrl}/events/publishEvent/${pid}`,
      {}
    );
  }

  cancelEvent(id: any) {
    return this.http.patch(
      `${this.apiUrl}/events/cancelEvent/${id}`,
      {}
    );
  }

  deleteEvent(id: any) {
    return this.http.delete(
      `${this.apiUrl}/events/deleteEvent/${id}`
    );
  }
}