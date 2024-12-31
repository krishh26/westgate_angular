import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerProjectDetailsComponent } from './project-manager-project-details.component';

describe('ProjectManagerProjectDetailsComponent', () => {
  let component: ProjectManagerProjectDetailsComponent;
  let fixture: ComponentFixture<ProjectManagerProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(ProjectManagerProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
