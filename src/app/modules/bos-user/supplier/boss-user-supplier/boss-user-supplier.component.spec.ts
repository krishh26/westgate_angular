import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserSupplierComponent } from './boss-user-supplier.component';

describe('BossUserSupplierComponent', () => {
  let component: BossUserSupplierComponent;
  let fixture: ComponentFixture<BossUserSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserSupplierComponent]
    });
    fixture = TestBed.createComponent(BossUserSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
