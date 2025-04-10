import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserRolesListComponent } from './bos-user-roles-list.component';

describe('BosUserRolesListComponent', () => {
  let component: BosUserRolesListComponent;
  let fixture: ComponentFixture<BosUserRolesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserRolesListComponent]
    });
    fixture = TestBed.createComponent(BosUserRolesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
