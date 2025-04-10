import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserSubExpertiseViewComponent } from './boss-user-sub-expertise-view.component';

describe('BossUserSubExpertiseViewComponent', () => {
  let component: BossUserSubExpertiseViewComponent;
  let fixture: ComponentFixture<BossUserSubExpertiseViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserSubExpertiseViewComponent]
    });
    fixture = TestBed.createComponent(BossUserSubExpertiseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
