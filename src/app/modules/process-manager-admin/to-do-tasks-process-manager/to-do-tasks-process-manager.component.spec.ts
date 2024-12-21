import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTasksProcessManagerComponent } from './to-do-tasks-process-manager.component';

describe('ToDoTasksProcessManagerComponent', () => {
  let component: ToDoTasksProcessManagerComponent;
  let fixture: ComponentFixture<ToDoTasksProcessManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToDoTasksProcessManagerComponent]
    });
    fixture = TestBed.createComponent(ToDoTasksProcessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
