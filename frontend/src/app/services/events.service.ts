import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http:HttpClient) { }

  getAllEvents(){
    return this.http.get("http://localhost:4300/events/")
  }
  registerForEvent(obj:any){
    return this.http.post("http://localhost:4300/registrations/",obj)
}

createEvent(event:any) {
    return this.http.post("http://localhost:4300/events/addEvent",event);
  }

   publishEvent(pid: any){
    console.log(pid)
    return this.http.patch("http://localhost:4300/events/publishEvent/"+pid,{});
  }

  cancelEvent(id:any){
    return this.http.patch("http://localhost:4300/events/cancelEvent/"+id,{});
  }

  deleteEvent(id:any) {
    return this.http.delete("http://localhost:4300/events/deleteEvent/"+id);
  }
}
