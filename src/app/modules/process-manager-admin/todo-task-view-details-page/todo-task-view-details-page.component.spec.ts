import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTaskViewDetailsPageComponent } from './todo-task-view-details-page.component';

describe('TodoTaskViewDetailsPageComponent', () => {
  let component: TodoTaskViewDetailsPageComponent;
  let fixture: ComponentFixture<TodoTaskViewDetailsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoTaskViewDetailsPageComponent]
    });
    fixture = TestBed.createComponent(TodoTaskViewDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
