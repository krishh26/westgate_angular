import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSupplierGapAnalysisComponent } from './no-supplier-gap-analysis.component';

describe('NoSupplierGapAnalysisComponent', () => {
  let component: NoSupplierGapAnalysisComponent;
  let fixture: ComponentFixture<NoSupplierGapAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoSupplierGapAnalysisComponent]
    });
    fixture = TestBed.createComponent(NoSupplierGapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
