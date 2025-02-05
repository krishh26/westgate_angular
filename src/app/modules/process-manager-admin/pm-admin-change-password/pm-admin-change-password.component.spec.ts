import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmAdminChangePasswordComponent } from './pm-admin-change-password.component';

describe('PmAdminChangePasswordComponent', () => {
  let component: PmAdminChangePasswordComponent;
  let fixture: ComponentFixture<PmAdminChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmAdminChangePasswordComponent]
    });
    fixture = TestBed.createComponent(PmAdminChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
