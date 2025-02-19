import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProcessManagerComponent } from './dashboard-process-manager.component';

describe('DashboardProcessManagerComponent', () => {
  let component: DashboardProcessManagerComponent;
  let fixture: ComponentFixture<DashboardProcessManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardProcessManagerComponent]
    });
    fixture = TestBed.createComponent(DashboardProcessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
