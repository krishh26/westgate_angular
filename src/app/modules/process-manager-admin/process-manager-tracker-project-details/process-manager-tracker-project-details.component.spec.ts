import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerTrackerProjectDetailsComponent } from './process-manager-tracker-project-details.component';

describe('ProcessManagerTrackerProjectDetailsComponent', () => {
  let component: ProcessManagerTrackerProjectDetailsComponent;
  let fixture: ComponentFixture<ProcessManagerTrackerProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessManagerTrackerProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(ProcessManagerTrackerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
