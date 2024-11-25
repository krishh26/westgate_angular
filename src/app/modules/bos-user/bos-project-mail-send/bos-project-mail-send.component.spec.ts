/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BosProjectMailSendComponent } from './bos-project-mail-send.component';

describe('BosProjectMailSendComponent', () => {
  let component: BosProjectMailSendComponent;
  let fixture: ComponentFixture<BosProjectMailSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BosProjectMailSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BosProjectMailSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
