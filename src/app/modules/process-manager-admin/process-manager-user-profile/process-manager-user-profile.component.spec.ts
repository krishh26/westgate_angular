import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagerUserProfileComponent } from './process-manager-user-profile.component';

describe('ProcessManagerUserProfileComponent', () => {
  let component: ProcessManagerUserProfileComponent;
  let fixture: ComponentFixture<ProcessManagerUserProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessManagerUserProfileComponent]
    });
    fixture = TestBed.createComponent(ProcessManagerUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
