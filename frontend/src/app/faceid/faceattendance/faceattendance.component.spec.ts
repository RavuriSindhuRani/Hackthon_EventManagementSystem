import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceattendanceComponent } from './faceattendance.component';

describe('FaceattendanceComponent', () => {
  let component: FaceattendanceComponent;
  let fixture: ComponentFixture<FaceattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaceattendanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaceattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
