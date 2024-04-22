import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoiViewDetailsComponent } from './foi-view-details.component';

describe('FoiViewDetailsComponent', () => {
  let component: FoiViewDetailsComponent;
  let fixture: ComponentFixture<FoiViewDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoiViewDetailsComponent]
    });
    fixture = TestBed.createComponent(FoiViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
