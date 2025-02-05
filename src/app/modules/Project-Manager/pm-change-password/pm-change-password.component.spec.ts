import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmChangePasswordComponent } from './pm-change-password.component';

describe('PmChangePasswordComponent', () => {
  let component: PmChangePasswordComponent;
  let fixture: ComponentFixture<PmChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmChangePasswordComponent]
    });
    fixture = TestBed.createComponent(PmChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
