import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierWiseProjectListComponent } from './supplier-wise-project-list.component';

describe('SupplierWiseProjectListComponent', () => {
  let component: SupplierWiseProjectListComponent;
  let fixture: ComponentFixture<SupplierWiseProjectListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierWiseProjectListComponent]
    });
    fixture = TestBed.createComponent(SupplierWiseProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
