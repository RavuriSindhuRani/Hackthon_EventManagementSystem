import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerdashboardComponent } from './volunteerdashboard.component';

describe('VolunteerdashboardComponent', () => {
  let component: VolunteerdashboardComponent;
  let fixture: ComponentFixture<VolunteerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteerdashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
