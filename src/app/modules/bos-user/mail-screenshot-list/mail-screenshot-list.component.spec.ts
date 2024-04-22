import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailScreenshotListComponent } from './mail-screenshot-list.component';

describe('MailScreenshotListComponent', () => {
  let component: MailScreenshotListComponent;
  let fixture: ComponentFixture<MailScreenshotListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailScreenshotListComponent]
    });
    fixture = TestBed.createComponent(MailScreenshotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
