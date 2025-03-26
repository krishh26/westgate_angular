import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesProductivityViewComponent } from './resources-productivity-view.component';

describe('ResourcesProductivityViewComponent', () => {
  let component: ResourcesProductivityViewComponent;
  let fixture: ComponentFixture<ResourcesProductivityViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcesProductivityViewComponent]
    });
    fixture = TestBed.createComponent(ResourcesProductivityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
