import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejectProjectComponent } from './approve-reject-project.component';

describe('ApproveRejectProjectComponent', () => {
  let component: ApproveRejectProjectComponent;
  let fixture: ComponentFixture<ApproveRejectProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproveRejectProjectComponent]
    });
    fixture = TestBed.createComponent(ApproveRejectProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
