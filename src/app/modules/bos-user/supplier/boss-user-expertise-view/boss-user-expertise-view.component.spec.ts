import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserExpertiseViewComponent } from './boss-user-expertise-view.component';

describe('BossUserExpertiseViewComponent', () => {
  let component: BossUserExpertiseViewComponent;
  let fixture: ComponentFixture<BossUserExpertiseViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserExpertiseViewComponent]
    });
    fixture = TestBed.createComponent(BossUserExpertiseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
