import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerReviewComponent } from './feasibility-manager-review.component';

describe('FeasibilityManagerReviewComponent', () => {
  let component: FeasibilityManagerReviewComponent;
  let fixture: ComponentFixture<FeasibilityManagerReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerReviewComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
