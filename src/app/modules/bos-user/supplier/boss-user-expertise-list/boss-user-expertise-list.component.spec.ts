import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserExpertiseListComponent } from './boss-user-expertise-list.component';

describe('BossUserExpertiseListComponent', () => {
  let component: BossUserExpertiseListComponent;
  let fixture: ComponentFixture<BossUserExpertiseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserExpertiseListComponent]
    });
    fixture = TestBed.createComponent(BossUserExpertiseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
