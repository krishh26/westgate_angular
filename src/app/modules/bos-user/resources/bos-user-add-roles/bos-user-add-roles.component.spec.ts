import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserAddRolesComponent } from './bos-user-add-roles.component';

describe('BosUserAddRolesComponent', () => {
  let component: BosUserAddRolesComponent;
  let fixture: ComponentFixture<BosUserAddRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserAddRolesComponent]
    });
    fixture = TestBed.createComponent(BosUserAddRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
