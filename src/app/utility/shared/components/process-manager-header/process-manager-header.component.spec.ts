import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerHeaderComponent } from './process-manager-header.component';

describe('ProcessManagerHeaderComponent', () => {
  let component: ProcessManagerHeaderComponent;
  let fixture: ComponentFixture<ProcessManagerHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessManagerHeaderComponent]
    });
    fixture = TestBed.createComponent(ProcessManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
