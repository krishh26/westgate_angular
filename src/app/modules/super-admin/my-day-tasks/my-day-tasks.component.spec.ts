import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDayTasksComponent } from './my-day-tasks.component';

describe('MyDayTasksComponent', () => {
  let component: MyDayTasksComponent;
  let fixture: ComponentFixture<MyDayTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyDayTasksComponent]
    });
    fixture = TestBed.createComponent(MyDayTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
