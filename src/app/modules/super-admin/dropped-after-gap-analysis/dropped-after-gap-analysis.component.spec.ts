import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroppedAfterGapAnalysisComponent } from './dropped-after-gap-analysis.component';

describe('DroppedAfterGapAnalysisComponent', () => {
  let component: DroppedAfterGapAnalysisComponent;
  let fixture: ComponentFixture<DroppedAfterGapAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DroppedAfterGapAnalysisComponent]
    });
    fixture = TestBed.createComponent(DroppedAfterGapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
