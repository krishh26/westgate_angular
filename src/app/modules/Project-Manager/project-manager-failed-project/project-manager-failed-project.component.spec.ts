import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerFailedProjectComponent } from './project-manager-failed-project.component';

describe('ProjectManagerFailedProjectComponent', () => {
  let component: ProjectManagerFailedProjectComponent;
  let fixture: ComponentFixture<ProjectManagerFailedProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerFailedProjectComponent]
    });
    fixture = TestBed.createComponent(ProjectManagerFailedProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
