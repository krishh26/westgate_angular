import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerToActionComponent } from './process-manager-to-action.component';

describe('ProcessManagerToActionComponent', () => {
  let component: ProcessManagerToActionComponent;
  let fixture: ComponentFixture<ProcessManagerToActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessManagerToActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessManagerToActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

