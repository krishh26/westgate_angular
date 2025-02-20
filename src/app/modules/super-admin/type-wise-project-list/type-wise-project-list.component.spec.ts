import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeWiseProjectListComponent } from './type-wise-project-list.component';

describe('TypeWiseProjectListComponent', () => {
  let component: TypeWiseProjectListComponent;
  let fixture: ComponentFixture<TypeWiseProjectListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeWiseProjectListComponent]
    });
    fixture = TestBed.createComponent(TypeWiseProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
