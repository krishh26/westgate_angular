import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTasksComponent } from './todo-tasks.component';

describe('TodoTasksComponent', () => {
  let component: TodoTasksComponent;
  let fixture: ComponentFixture<TodoTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoTasksComponent]
    });
    fixture = TestBed.createComponent(TodoTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
