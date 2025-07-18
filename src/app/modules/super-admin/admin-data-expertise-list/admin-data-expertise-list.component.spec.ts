import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataExpertiseListComponent } from './admin-data-expertise-list.component';

describe('AdminDataExpertiseListComponent', () => {
  let component: AdminDataExpertiseListComponent;
  let fixture: ComponentFixture<AdminDataExpertiseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDataExpertiseListComponent]
    });
    fixture = TestBed.createComponent(AdminDataExpertiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
