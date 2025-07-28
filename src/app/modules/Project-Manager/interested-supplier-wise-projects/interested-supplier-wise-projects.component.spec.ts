import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedSupplierWiseProjectsComponent } from './interested-supplier-wise-projects.component';

describe('InterestedSupplierWiseProjectsComponent', () => {
  let component: InterestedSupplierWiseProjectsComponent;
  let fixture: ComponentFixture<InterestedSupplierWiseProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterestedSupplierWiseProjectsComponent]
    });
    fixture = TestBed.createComponent(InterestedSupplierWiseProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
