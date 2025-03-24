import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubExpertiseViewComponent } from './sub-expertise-view.component';

describe('SubExpertiseViewComponent', () => {
  let component: SubExpertiseViewComponent;
  let fixture: ComponentFixture<SubExpertiseViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubExpertiseViewComponent]
    });
    fixture = TestBed.createComponent(SubExpertiseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
