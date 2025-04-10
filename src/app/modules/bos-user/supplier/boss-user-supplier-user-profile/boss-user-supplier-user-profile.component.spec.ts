import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserSupplierUserProfileComponent } from './boss-user-supplier-user-profile.component';

describe('BossUserSupplierUserProfileComponent', () => {
  let component: BossUserSupplierUserProfileComponent;
  let fixture: ComponentFixture<BossUserSupplierUserProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserSupplierUserProfileComponent]
    });
    fixture = TestBed.createComponent(BossUserSupplierUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
