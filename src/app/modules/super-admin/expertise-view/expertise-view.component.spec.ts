import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseViewComponent } from './expertise-view.component';

describe('ExpertiseViewComponent', () => {
  let component: ExpertiseViewComponent;
  let fixture: ComponentFixture<ExpertiseViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertiseViewComponent]
    });
    fixture = TestBed.createComponent(ExpertiseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
