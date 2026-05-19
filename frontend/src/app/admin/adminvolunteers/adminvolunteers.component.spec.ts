import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminvolunteersComponent } from './adminvolunteers.component';

describe('AdminvolunteersComponent', () => {
  let component: AdminvolunteersComponent;
  let fixture: ComponentFixture<AdminvolunteersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminvolunteersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminvolunteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
