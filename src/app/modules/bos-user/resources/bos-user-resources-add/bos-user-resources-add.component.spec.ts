import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesAddComponent } from './bos-user-resources-add.component';

describe('BosUserResourcesAddComponent', () => {
  let component: BosUserResourcesAddComponent;
  let fixture: ComponentFixture<BosUserResourcesAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesAddComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
