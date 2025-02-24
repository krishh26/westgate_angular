import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailAproveRejectComponent } from './fail-aprove-reject.component';

describe('FailAproveRejectComponent', () => {
  let component: FailAproveRejectComponent;
  let fixture: ComponentFixture<FailAproveRejectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailAproveRejectComponent]
    });
    fixture = TestBed.createComponent(FailAproveRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
