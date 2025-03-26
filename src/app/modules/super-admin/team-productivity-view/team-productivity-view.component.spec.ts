import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamProductivityViewComponent } from './team-productivity-view.component';

describe('TeamProductivityViewComponent', () => {
  let component: TeamProductivityViewComponent;
  let fixture: ComponentFixture<TeamProductivityViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamProductivityViewComponent]
    });
    fixture = TestBed.createComponent(TeamProductivityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
