import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerCompletedComponent } from './process-manager-completed.component';

describe('ProcessManagerCompletedComponent', () => {
  let component: ProcessManagerCompletedComponent;
  let fixture: ComponentFixture<ProcessManagerCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessManagerCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessManagerCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

