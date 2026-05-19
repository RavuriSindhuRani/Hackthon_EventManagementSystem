import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StudenteventComponent } from './student/studentevent/studentevent.component';
import { StudentattendanceComponent } from './student/studentattendance/studentattendance.component';
import { StudentprofileComponent } from './student/studentprofile/studentprofile.component';
import { StudentregistrationComponent } from './student/studentregistration/studentregistration.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { AdminevetsComponent } from './admin/adminevets/adminevets.component';
import { AdminregisrationsComponent } from './admin/adminregisrations/adminregisrations.component';
import { AdminattendanceComponent } from './admin/adminattendance/adminattendance.component';
import { AdminvolunteersComponent } from './admin/adminvolunteers/adminvolunteers.component';
import { AdminstudentComponent } from './admin/adminstudent/adminstudent.component';
import { AdminprofileComponent } from './admin/adminprofile/adminprofile.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PageComponent } from './landing/page/page.component';
import { WebcamModule } from 'ngx-webcam';
import { VolunteerdashboardComponent } from './volunteer/volunteerdashboard/volunteerdashboard.component';
import { VolunteereventsComponent } from './volunteer/volunteerevents/volunteerevents.component';
import { VolunteerregistratonComponent } from './volunteer/volunteerregistraton/volunteerregistraton.component';
import { VolunteerattendanceComponent } from './volunteer/volunteerattendance/volunteerattendance.component';
import { VolunteermyhoursComponent } from './volunteer/volunteermyhours/volunteermyhours.component';
import { FaceattendanceComponent } from './faceid/faceattendance/faceattendance.component';
import { VolunteerprofileComponent } from './volunteer/volunteerprofile/volunteerprofile.component';
import { VolunteerstudentComponent } from './volunteer/volunteerstudent/volunteerstudent.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    StudenteventComponent,
    StudentattendanceComponent,
    StudentprofileComponent,
    StudentregistrationComponent,
    AdmindashboardComponent,
    AdminevetsComponent,
    AdminregisrationsComponent,
    AdminattendanceComponent,
    AdminvolunteersComponent,
    AdminstudentComponent,
    AdminprofileComponent,
    LoginComponent,
    SignupComponent,
    PageComponent,
    VolunteerdashboardComponent,
    VolunteereventsComponent,
    VolunteerregistratonComponent,
    VolunteerattendanceComponent,
    VolunteermyhoursComponent,
    FaceattendanceComponent,
    VolunteerprofileComponent,
    VolunteerstudentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
