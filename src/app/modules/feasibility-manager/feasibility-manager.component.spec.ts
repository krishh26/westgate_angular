import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerComponent } from './feasibility-manager.component';

describe('FeasibilityManagerComponent', () => {
  let component: FeasibilityManagerComponent;
  let fixture: ComponentFixture<FeasibilityManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
