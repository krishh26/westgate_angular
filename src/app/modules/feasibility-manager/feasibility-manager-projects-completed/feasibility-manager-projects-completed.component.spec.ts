import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerProjectsCompletedComponent } from './feasibility-manager-projects-completed.component';

describe('FeasibilityManagerProjectsCompletedComponent', () => {
  let component: FeasibilityManagerProjectsCompletedComponent;
  let fixture: ComponentFixture<FeasibilityManagerProjectsCompletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerProjectsCompletedComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerProjectsCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
