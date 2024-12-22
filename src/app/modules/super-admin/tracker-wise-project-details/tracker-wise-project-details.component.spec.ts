import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerWiseProjectDetailsComponent } from './tracker-wise-project-details.component';

describe('TrackerWiseProjectDetailsComponent', () => {
  let component: TrackerWiseProjectDetailsComponent;
  let fixture: ComponentFixture<TrackerWiseProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerWiseProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(TrackerWiseProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
