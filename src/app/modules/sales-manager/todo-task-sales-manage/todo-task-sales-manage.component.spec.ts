import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoTaskSalesManageComponent } from './todo-task-sales-manage.component';

describe('TodoTaskSalesManageComponent', () => {
  let component: TodoTaskSalesManageComponent;
  let fixture: ComponentFixture<TodoTaskSalesManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoTaskSalesManageComponent]
    });
    fixture = TestBed.createComponent(TodoTaskSalesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
