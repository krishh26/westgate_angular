import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeWiseProjectDetailsComponent } from './type-wise-project-details.component';

describe('TypeWiseProjectDetailsComponent', () => {
  let component: TypeWiseProjectDetailsComponent;
  let fixture: ComponentFixture<TypeWiseProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeWiseProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(TypeWiseProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
