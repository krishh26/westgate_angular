import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagerHeaderComponent } from './sales-manager-header.component';

describe('SalesManagerHeaderComponent', () => {
  let component: SalesManagerHeaderComponent;
  let fixture: ComponentFixture<SalesManagerHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesManagerHeaderComponent]
    });
    fixture = TestBed.createComponent(SalesManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
