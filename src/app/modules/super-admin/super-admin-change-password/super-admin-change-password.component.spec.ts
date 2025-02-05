import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminChangePasswordComponent } from './super-admin-change-password.component';

describe('SuperAdminChangePasswordComponent', () => {
  let component: SuperAdminChangePasswordComponent;
  let fixture: ComponentFixture<SuperAdminChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperAdminChangePasswordComponent]
    });
    fixture = TestBed.createComponent(SuperAdminChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
