import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubExpertiseViewBidManagerComponent } from './sub-expertise-view-bid-manager.component';

describe('SubExpertiseViewBidManagerComponent', () => {
  let component: SubExpertiseViewBidManagerComponent;
  let fixture: ComponentFixture<SubExpertiseViewBidManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubExpertiseViewBidManagerComponent]
    });
    fixture = TestBed.createComponent(SubExpertiseViewBidManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
