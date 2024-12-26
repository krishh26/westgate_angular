import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerAwaitingSectionComponent } from './feasibility-manager-awaiting-section.component';

describe('FeasibilityManagerAwaitingSectionComponent', () => {
  let component: FeasibilityManagerAwaitingSectionComponent;
  let fixture: ComponentFixture<FeasibilityManagerAwaitingSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerAwaitingSectionComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerAwaitingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
