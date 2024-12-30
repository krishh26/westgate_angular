import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerTrackerComponent } from './process-manager-tracker.component';

describe('ProcessManagerTrackerComponent', () => {
  let component: ProcessManagerTrackerComponent;
  let fixture: ComponentFixture<ProcessManagerTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessManagerTrackerComponent]
    });
    fixture = TestBed.createComponent(ProcessManagerTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
