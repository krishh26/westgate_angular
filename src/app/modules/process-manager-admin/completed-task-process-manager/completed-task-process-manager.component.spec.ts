import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTaskProcessManagerComponent } from './completed-task-process-manager.component';

describe('CompletedTaskProcessManagerComponent', () => {
  let component: CompletedTaskProcessManagerComponent;
  let fixture: ComponentFixture<CompletedTaskProcessManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedTaskProcessManagerComponent]
    });
    fixture = TestBed.createComponent(CompletedTaskProcessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
