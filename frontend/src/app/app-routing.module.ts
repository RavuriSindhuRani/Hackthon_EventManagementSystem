import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { StudenteventComponent } from './student/studentevent/studentevent.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { AdminevetsComponent } from './admin/adminevets/adminevets.component';
import { StudentprofileComponent } from './student/studentprofile/studentprofile.component';
import { StudentattendanceComponent } from './student/studentattendance/studentattendance.component';
import { StudentregistrationComponent } from './student/studentregistration/studentregistration.component';
import { AdminregisrationsComponent } from './admin/adminregisrations/adminregisrations.component';
import { AdminstudentComponent } from './admin/adminstudent/adminstudent.component';
import { AdminvolunteersComponent } from './admin/adminvolunteers/adminvolunteers.component';
import { AdminattendanceComponent } from './admin/adminattendance/adminattendance.component';
import { AdminprofileComponent } from './admin/adminprofile/adminprofile.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { VolunteerdashboardComponent } from './volunteer/volunteerdashboard/volunteerdashboard.component';
import { VolunteerattendanceComponent } from './volunteer/volunteerattendance/volunteerattendance.component';
import { VolunteerprofileComponent } from './volunteer/volunteerprofile/volunteerprofile.component';
import { VolunteerregistratonComponent } from './volunteer/volunteerregistraton/volunteerregistraton.component';
import { VolunteereventsComponent } from './volunteer/volunteerevents/volunteerevents.component';
import { VolunteermyhoursComponent } from './volunteer/volunteermyhours/volunteermyhours.component';
import { FaceattendanceComponent } from './faceid/faceattendance/faceattendance.component';
import { PageComponent } from './landing/page/page.component';
import { VolunteerstudentComponent } from './volunteer/volunteerstudent/volunteerstudent.component';

const routes: Routes = [
  {path:'',component:PageComponent},
{path: 'auth', redirectTo: 'login', pathMatch: 'full'},
{path: 'login', component: LoginComponent},
{path: 'signup', component: SignupComponent},
{path:'',component:NavbarComponent,
  children:[
    {path:'dashboard',component:DashboardComponent},
    {path:'studentevent',component:StudenteventComponent},
    {path:"profile",component:StudentprofileComponent},
    {path:'attendance',component:StudentattendanceComponent},
    {path:"registration",component:StudentregistrationComponent}
  ]
},
{path:'admin',component:NavbarComponent,
  children:[
    {path:"dashboard",component:AdmindashboardComponent},
    {path:"events",component:AdminevetsComponent},
    {path:"registrations",component:AdminregisrationsComponent},
    {path:"students",component:AdminstudentComponent},
    {path:"volunteers",component:AdminvolunteersComponent},
    {path:"attendance",component:AdminattendanceComponent},
    {path:"profile",component:AdminprofileComponent}
  ]
},
{path:"volunteer",component:NavbarComponent,
  children:[
    {path:"dashboard",component:VolunteerdashboardComponent},
    {path:"attendance",component:VolunteerattendanceComponent},
    {path:"profile",component:VolunteerprofileComponent},
    {path:"registraton",component:VolunteerregistratonComponent},
    {path:"events",component:VolunteereventsComponent},
    {path:"myhours",component:VolunteermyhoursComponent},
    {path:'student',component:VolunteerstudentComponent}
  ]
},
{path:'faceattendance',component:FaceattendanceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
