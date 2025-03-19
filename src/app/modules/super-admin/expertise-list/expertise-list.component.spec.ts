import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseListComponent } from './expertise-list.component';

describe('ExpertiseListComponent', () => {
  let component: ExpertiseListComponent;
  let fixture: ComponentFixture<ExpertiseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertiseListComponent]
    });
    fixture = TestBed.createComponent(ExpertiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
