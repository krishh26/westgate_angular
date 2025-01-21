import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTodoTaskComponent } from './completed-todo-task.component';

describe('CompletedTodoTaskComponent', () => {
  let component: CompletedTodoTaskComponent;
  let fixture: ComponentFixture<CompletedTodoTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedTodoTaskComponent]
    });
    fixture = TestBed.createComponent(CompletedTodoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
