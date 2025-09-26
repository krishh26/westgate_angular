import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerProjectFailedComponent } from './process-manager-project-failed.component';

describe('ProcessManagerProjectFailedComponent', () => {
  let component: ProcessManagerProjectFailedComponent;
  let fixture: ComponentFixture<ProcessManagerProjectFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessManagerProjectFailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessManagerProjectFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

