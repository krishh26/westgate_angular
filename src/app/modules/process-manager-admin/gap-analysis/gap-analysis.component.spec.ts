import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GapAnalysisComponent } from './gap-analysis.component';

describe('GapAnalysisComponent', () => {
  let component: GapAnalysisComponent;
  let fixture: ComponentFixture<GapAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GapAnalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




