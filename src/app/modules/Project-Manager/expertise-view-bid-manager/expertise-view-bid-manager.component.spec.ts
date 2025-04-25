import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertiseViewBidManagerComponent } from './expertise-view-bid-manager.component';

describe('ExpertiseViewBidManagerComponent', () => {
  let component: ExpertiseViewBidManagerComponent;
  let fixture: ComponentFixture<ExpertiseViewBidManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertiseViewBidManagerComponent]
    });
    fixture = TestBed.createComponent(ExpertiseViewBidManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
