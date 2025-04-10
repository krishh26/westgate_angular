import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserAddNewCaseStudyComponent } from './boss-user-add-new-case-study.component';

describe('BossUserAddNewCaseStudyComponent', () => {
  let component: BossUserAddNewCaseStudyComponent;
  let fixture: ComponentFixture<BossUserAddNewCaseStudyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserAddNewCaseStudyComponent]
    });
    fixture = TestBed.createComponent(BossUserAddNewCaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
