import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerInProgressComponent } from './process-manager-in-progress.component';

describe('ProcessManagerInProgressComponent', () => {
  let component: ProcessManagerInProgressComponent;
  let fixture: ComponentFixture<ProcessManagerInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessManagerInProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessManagerInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

