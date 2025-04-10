import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesAddBulkComponent } from './bos-user-resources-add-bulk.component';

describe('BosUserResourcesAddBulkComponent', () => {
  let component: BosUserResourcesAddBulkComponent;
  let fixture: ComponentFixture<BosUserResourcesAddBulkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesAddBulkComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesAddBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
