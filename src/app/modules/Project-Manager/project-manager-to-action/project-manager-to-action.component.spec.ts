import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerToActionComponent } from './project-manager-to-action.component';

describe('ProjectManagerToActionComponent', () => {
  let component: ProjectManagerToActionComponent;
  let fixture: ComponentFixture<ProjectManagerToActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectManagerToActionComponent]
    });
    fixture = TestBed.createComponent(ProjectManagerToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
