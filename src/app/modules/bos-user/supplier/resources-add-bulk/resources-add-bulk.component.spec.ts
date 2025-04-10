import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesAddBulkComponent } from './resources-add-bulk.component';

describe('ResourcesAddBulkComponent', () => {
  let component: ResourcesAddBulkComponent;
  let fixture: ComponentFixture<ResourcesAddBulkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcesAddBulkComponent]
    });
    fixture = TestBed.createComponent(ResourcesAddBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
