import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityManagerHeaderComponent } from './feasibility-manager-header.component';

describe('FeasibilityManagerHeaderComponent', () => {
  let component: FeasibilityManagerHeaderComponent;
  let fixture: ComponentFixture<FeasibilityManagerHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityManagerHeaderComponent]
    });
    fixture = TestBed.createComponent(FeasibilityManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
