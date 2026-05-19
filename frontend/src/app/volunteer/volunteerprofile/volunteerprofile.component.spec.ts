import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerprofileComponent } from './volunteerprofile.component';

describe('VolunteerprofileComponent', () => {
  let component: VolunteerprofileComponent;
  let fixture: ComponentFixture<VolunteerprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteerprofileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
