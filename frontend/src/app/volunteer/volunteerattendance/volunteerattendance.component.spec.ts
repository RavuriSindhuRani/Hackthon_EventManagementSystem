import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerattendanceComponent } from './volunteerattendance.component';

describe('VolunteerattendanceComponent', () => {
  let component: VolunteerattendanceComponent;
  let fixture: ComponentFixture<VolunteerattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteerattendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteerattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
