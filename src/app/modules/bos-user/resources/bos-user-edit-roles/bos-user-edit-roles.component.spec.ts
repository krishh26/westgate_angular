import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserEditRolesComponent } from './bos-user-edit-roles.component';

describe('BosUserEditRolesComponent', () => {
  let component: BosUserEditRolesComponent;
  let fixture: ComponentFixture<BosUserEditRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserEditRolesComponent]
    });
    fixture = TestBed.createComponent(BosUserEditRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
