import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerProjectDetailsComponent } from './feasibility-manager-project-details.component';

describe('FeasibilityManagerProjectDetailsComponent', () => {
  let component: FeasibilityManagerProjectDetailsComponent;
  let fixture: ComponentFixture<FeasibilityManagerProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
