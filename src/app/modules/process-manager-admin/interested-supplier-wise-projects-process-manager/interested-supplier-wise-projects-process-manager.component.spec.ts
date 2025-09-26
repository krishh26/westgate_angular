import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedSupplierWiseProjectsProcessManagerComponent } from './interested-supplier-wise-projects-process-manager.component';

describe('InterestedSupplierWiseProjectsProcessManagerComponent', () => {
  let component: InterestedSupplierWiseProjectsProcessManagerComponent;
  let fixture: ComponentFixture<InterestedSupplierWiseProjectsProcessManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterestedSupplierWiseProjectsProcessManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestedSupplierWiseProjectsProcessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

