import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerProjectCloseComponent } from './project-manager-project-close.component';

describe('ProjectManagerProjectCloseComponent', () => {
  let component: ProjectManagerProjectCloseComponent;
  let fixture: ComponentFixture<ProjectManagerProjectCloseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerProjectCloseComponent]
    });
    fixture = TestBed.createComponent(ProjectManagerProjectCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
