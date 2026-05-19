import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminevetsComponent } from './adminevets.component';

describe('AdminevetsComponent', () => {
  let component: AdminevetsComponent;
  let fixture: ComponentFixture<AdminevetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminevetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminevetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
