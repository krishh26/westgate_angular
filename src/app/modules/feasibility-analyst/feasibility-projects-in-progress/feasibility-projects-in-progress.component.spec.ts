import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityProjectsInProgressComponent } from './feasibility-projects-in-progress.component';

describe('FeasibilityProjectsInProgressComponent', () => {
  let component: FeasibilityProjectsInProgressComponent;
  let fixture: ComponentFixture<FeasibilityProjectsInProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityProjectsInProgressComponent]
    });
    fixture = TestBed.createComponent(FeasibilityProjectsInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
