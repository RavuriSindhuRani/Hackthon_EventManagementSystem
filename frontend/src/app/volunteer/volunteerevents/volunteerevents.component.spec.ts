import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteereventsComponent } from './volunteerevents.component';

describe('VolunteereventsComponent', () => {
  let component: VolunteereventsComponent;
  let fixture: ComponentFixture<VolunteereventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteereventsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteereventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
