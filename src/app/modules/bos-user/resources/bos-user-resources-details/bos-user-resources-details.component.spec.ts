import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesDetailsComponent } from './bos-user-resources-details.component';

describe('BosUserResourcesDetailsComponent', () => {
  let component: BosUserResourcesDetailsComponent;
  let fixture: ComponentFixture<BosUserResourcesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesDetailsComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
