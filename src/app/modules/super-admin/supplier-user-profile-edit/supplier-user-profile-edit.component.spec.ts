import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUserProfileEditComponent } from './supplier-user-profile-edit.component';

describe('SupplierUserProfileEditComponent', () => {
  let component: SupplierUserProfileEditComponent;
  let fixture: ComponentFixture<SupplierUserProfileEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierUserProfileEditComponent]
    });
    fixture = TestBed.createComponent(SupplierUserProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
