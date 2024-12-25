import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityProjectsCompletedComponent } from './feasibility-projects-completed.component';

describe('FeasibilityProjectsCompletedComponent', () => {
  let component: FeasibilityProjectsCompletedComponent;
  let fixture: ComponentFixture<FeasibilityProjectsCompletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityProjectsCompletedComponent]
    });
    fixture = TestBed.createComponent(FeasibilityProjectsCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
