import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerregistratonComponent } from './volunteerregistraton.component';

describe('VolunteerregistratonComponent', () => {
  let component: VolunteerregistratonComponent;
  let fixture: ComponentFixture<VolunteerregistratonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteerregistratonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteerregistratonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
