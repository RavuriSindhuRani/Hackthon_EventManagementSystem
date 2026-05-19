import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteermyhoursComponent } from './volunteermyhours.component';

describe('VolunteermyhoursComponent', () => {
  let component: VolunteermyhoursComponent;
  let fixture: ComponentFixture<VolunteermyhoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VolunteermyhoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolunteermyhoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
