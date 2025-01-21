import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDayTodoTaskComponent } from './my-day-todo-task.component';

describe('MyDayTodoTaskComponent', () => {
  let component: MyDayTodoTaskComponent;
  let fixture: ComponentFixture<MyDayTodoTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyDayTodoTaskComponent]
    });
    fixture = TestBed.createComponent(MyDayTodoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
