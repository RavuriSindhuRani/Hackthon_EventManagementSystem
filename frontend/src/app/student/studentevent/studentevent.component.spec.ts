import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudenteventComponent } from './studentevent.component';

describe('StudenteventComponent', () => {
  let component: StudenteventComponent;
  let fixture: ComponentFixture<StudenteventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudenteventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudenteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
