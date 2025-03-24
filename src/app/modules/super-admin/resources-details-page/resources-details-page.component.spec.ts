import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesDetailsPageComponent } from './resources-details-page.component';

describe('ResourcesDetailsPageComponent', () => {
  let component: ResourcesDetailsPageComponent;
  let fixture: ComponentFixture<ResourcesDetailsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcesDetailsPageComponent]
    });
    fixture = TestBed.createComponent(ResourcesDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
