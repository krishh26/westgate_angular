import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSupplierMatchProjectsComponent } from './no-supplier-match-projects.component';

describe('NoSupplierMatchProjectsComponent', () => {
  let component: NoSupplierMatchProjectsComponent;
  let fixture: ComponentFixture<NoSupplierMatchProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoSupplierMatchProjectsComponent]
    });
    fixture = TestBed.createComponent(NoSupplierMatchProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
