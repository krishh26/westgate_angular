import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerProjectsInProgressComponent } from './feasibility-manager-projects-in-progress.component';

describe('FeasibilityManagerProjectsInProgressComponent', () => {
  let component: FeasibilityManagerProjectsInProgressComponent;
  let fixture: ComponentFixture<FeasibilityManagerProjectsInProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerProjectsInProgressComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerProjectsInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
