import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserResourcesDetailsComponent } from './boss-user-resources-details.component';

describe('BossUserResourcesDetailsComponent', () => {
  let component: BossUserResourcesDetailsComponent;
  let fixture: ComponentFixture<BossUserResourcesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserResourcesDetailsComponent]
    });
    fixture = TestBed.createComponent(BossUserResourcesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
