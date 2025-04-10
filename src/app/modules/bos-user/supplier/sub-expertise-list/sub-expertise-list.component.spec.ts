import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubExpertiseListComponent } from './sub-expertise-list.component';

describe('SubExpertiseListComponent', () => {
  let component: SubExpertiseListComponent;
  let fixture: ComponentFixture<SubExpertiseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubExpertiseListComponent]
    });
    fixture = TestBed.createComponent(SubExpertiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
