import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserResourcesCommentModalComponent } from './bos-user-resources-comment-modal.component';

describe('BosUserResourcesCommentModalComponent', () => {
  let component: BosUserResourcesCommentModalComponent;
  let fixture: ComponentFixture<BosUserResourcesCommentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserResourcesCommentModalComponent]
    });
    fixture = TestBed.createComponent(BosUserResourcesCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
