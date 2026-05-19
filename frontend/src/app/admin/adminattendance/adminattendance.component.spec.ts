import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminattendanceComponent } from './adminattendance.component';

describe('AdminattendanceComponent', () => {
  let component: AdminattendanceComponent;
  let fixture: ComponentFixture<AdminattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminattendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
