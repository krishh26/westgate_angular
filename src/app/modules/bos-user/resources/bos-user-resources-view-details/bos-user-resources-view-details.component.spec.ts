import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesViewDetailsComponent } from './bos-user-resources-view-details.component';

describe('BosUserResourcesViewDetailsComponent', () => {
  let component: BosUserResourcesViewDetailsComponent;
  let fixture: ComponentFixture<BosUserResourcesViewDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesViewDetailsComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
