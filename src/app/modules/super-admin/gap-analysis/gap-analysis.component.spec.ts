import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapAnalysisComponent } from './gap-analysis.component';

describe('GapAnalysisComponent', () => {
  let component: GapAnalysisComponent;
  let fixture: ComponentFixture<GapAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GapAnalysisComponent]
    });
    fixture = TestBed.createComponent(GapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
