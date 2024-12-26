import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerProjectsToActionComponent } from './feasibility-manager-projects-to-action.component';

describe('FeasibilityManagerProjectsToActionComponent', () => {
  let component: FeasibilityManagerProjectsToActionComponent;
  let fixture: ComponentFixture<FeasibilityManagerProjectsToActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerProjectsToActionComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerProjectsToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
