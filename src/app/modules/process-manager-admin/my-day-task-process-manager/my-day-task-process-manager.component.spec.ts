import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDayTaskProcessManagerComponent } from './my-day-task-process-manager.component';

describe('MyDayTaskProcessManagerComponent', () => {
  let component: MyDayTaskProcessManagerComponent;
  let fixture: ComponentFixture<MyDayTaskProcessManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyDayTaskProcessManagerComponent]
    });
    fixture = TestBed.createComponent(MyDayTaskProcessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
