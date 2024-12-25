import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityProjectsToActionComponent } from './feasibility-projects-to-action.component';

describe('FeasibilityProjectsToActionComponent', () => {
  let component: FeasibilityProjectsToActionComponent;
  let fixture: ComponentFixture<FeasibilityProjectsToActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityProjectsToActionComponent]
    });
    fixture = TestBed.createComponent(FeasibilityProjectsToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
