import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserSupplierUserProfileEditComponent } from './boss-user-supplier-user-profile-edit.component';

describe('BossUserSupplierUserProfileEditComponent', () => {
  let component: BossUserSupplierUserProfileEditComponent;
  let fixture: ComponentFixture<BossUserSupplierUserProfileEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserSupplierUserProfileEditComponent]
    });
    fixture = TestBed.createComponent(BossUserSupplierUserProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
