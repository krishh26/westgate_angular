import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTaskViewDetailsComponent } from './todo-task-view-details.component';

describe('TodoTaskViewDetailsComponent', () => {
  let component: TodoTaskViewDetailsComponent;
  let fixture: ComponentFixture<TodoTaskViewDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoTaskViewDetailsComponent]
    });
    fixture = TestBed.createComponent(TodoTaskViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
