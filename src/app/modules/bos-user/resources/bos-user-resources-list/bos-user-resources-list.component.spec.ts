import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesListComponent } from './bos-user-resources-list.component';

describe('BosUserResourcesListComponent', () => {
  let component: BosUserResourcesListComponent;
  let fixture: ComponentFixture<BosUserResourcesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesListComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
