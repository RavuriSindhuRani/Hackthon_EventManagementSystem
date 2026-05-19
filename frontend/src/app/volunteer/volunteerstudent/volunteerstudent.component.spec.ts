import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerstudentComponent } from './volunteerstudent.component';

describe('VolunteerstudentComponent', () => {
  let component: VolunteerstudentComponent;
  let fixture: ComponentFixture<VolunteerstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteerstudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteerstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
