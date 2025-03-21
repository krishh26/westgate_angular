import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesListComponent } from './resources-list.component';

describe('ResourcesListComponent', () => {
  let component: ResourcesListComponent;
  let fixture: ComponentFixture<ResourcesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcesListComponent]
    });
    fixture = TestBed.createComponent(ResourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
