import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedProjectDetailsComponent } from './completed-project-details.component';

describe('CompletedProjectDetailsComponent', () => {
  let component: CompletedProjectDetailsComponent;
  let fixture: ComponentFixture<CompletedProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(CompletedProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
