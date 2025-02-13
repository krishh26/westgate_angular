import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectProjectDetailsComponent } from './approve-reject-project-details.component';

describe('ApproveRejectProjectDetailsComponent', () => {
  let component: ApproveRejectProjectDetailsComponent;
  let fixture: ComponentFixture<ApproveRejectProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveRejectProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(ApproveRejectProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
