import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserResourcesAddComponent } from './boss-user-resources-add.component';

describe('BossUserResourcesAddComponent', () => {
  let component: BossUserResourcesAddComponent;
  let fixture: ComponentFixture<BossUserResourcesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserResourcesAddComponent]
    });
    fixture = TestBed.createComponent(BossUserResourcesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
