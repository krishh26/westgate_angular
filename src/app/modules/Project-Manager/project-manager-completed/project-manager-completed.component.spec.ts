import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerCompletedComponent } from './project-manager-completed.component';

describe('ProjectManagerCompletedComponent', () => {
  let component: ProjectManagerCompletedComponent;
  let fixture: ComponentFixture<ProjectManagerCompletedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerCompletedComponent]
    });
    fixture = TestBed.createComponent(ProjectManagerCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
