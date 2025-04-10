import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossUserResourcesListComponent } from './boss-user-resources-list.component';

describe('BossUserResourcesListComponent', () => {
  let component: BossUserResourcesListComponent;
  let fixture: ComponentFixture<BossUserResourcesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BossUserResourcesListComponent]
    });
    fixture = TestBed.createComponent(BossUserResourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
