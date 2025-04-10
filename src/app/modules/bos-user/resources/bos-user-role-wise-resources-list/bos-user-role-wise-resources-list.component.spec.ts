import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserRoleWiseResourcesListComponent } from './bos-user-role-wise-resources-list.component';

describe('BosUserRoleWiseResourcesListComponent', () => {
  let component: BosUserRoleWiseResourcesListComponent;
  let fixture: ComponentFixture<BosUserRoleWiseResourcesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserRoleWiseResourcesListComponent]
    });
    fixture = TestBed.createComponent(BosUserRoleWiseResourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
