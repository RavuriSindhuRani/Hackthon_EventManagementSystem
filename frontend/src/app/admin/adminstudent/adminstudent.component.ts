import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adminstudent',
  templateUrl: './adminstudent.component.html',
  styleUrl: './adminstudent.component.css'
})
export class AdminstudentComponent implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];
  loading = true;
  searchTerm = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<any[]>('http://localhost:4300/auth/students').subscribe({
      next: (res) => {
        this.students = res;
        this.filteredStudents = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterStudents() {
    this.filteredStudents = this.students.filter(s => 
      (s.firstName + ' ' + s.lastName).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewImpact(student: any) {
    // Navigate to a detailed impact view or open a modal
    alert(`Viewing impact for ${student.firstName}. Participation count: ${student.participationCount}`);
  }
}
