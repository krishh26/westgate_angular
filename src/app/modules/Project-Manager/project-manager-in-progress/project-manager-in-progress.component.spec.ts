import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerInProgressComponent } from './project-manager-in-progress.component';

describe('ProjectManagerInProgressComponent', () => {
  let component: ProjectManagerInProgressComponent;
  let fixture: ComponentFixture<ProjectManagerInProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerInProgressComponent]
    });
    fixture = TestBed.createComponent(ProjectManagerInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
