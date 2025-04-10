import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesViewComponent } from './bos-user-resources-view.component';

describe('BosUserResourcesViewComponent', () => {
  let component: BosUserResourcesViewComponent;
  let fixture: ComponentFixture<BosUserResourcesViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesViewComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
