import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminregisrationsComponent } from './adminregisrations.component';

describe('AdminregisrationsComponent', () => {
  let component: AdminregisrationsComponent;
  let fixture: ComponentFixture<AdminregisrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminregisrationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminregisrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
