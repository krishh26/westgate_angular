import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTodoTaskComponent } from './ongoing-todo-task.component';

describe('OngoingTodoTaskComponent', () => {
  let component: OngoingTodoTaskComponent;
  let fixture: ComponentFixture<OngoingTodoTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OngoingTodoTaskComponent]
    });
    fixture = TestBed.createComponent(OngoingTodoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
