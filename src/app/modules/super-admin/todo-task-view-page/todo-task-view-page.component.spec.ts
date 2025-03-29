import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTaskViewPageComponent } from './todo-task-view-page.component';

describe('TodoTaskViewPageComponent', () => {
  let component: TodoTaskViewPageComponent;
  let fixture: ComponentFixture<TodoTaskViewPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoTaskViewPageComponent]
    });
    fixture = TestBed.createComponent(TodoTaskViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
