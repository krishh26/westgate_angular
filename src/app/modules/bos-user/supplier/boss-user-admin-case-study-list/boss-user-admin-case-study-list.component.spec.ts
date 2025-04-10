import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserAdminCaseStudyListComponent } from './boss-user-admin-case-study-list.component';

describe('BossUserAdminCaseStudyListComponent', () => {
  let component: BossUserAdminCaseStudyListComponent;
  let fixture: ComponentFixture<BossUserAdminCaseStudyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserAdminCaseStudyListComponent]
    });
    fixture = TestBed.createComponent(BossUserAdminCaseStudyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
