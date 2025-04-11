import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BosUserProjectDetailsComponent } from './bos-user-project-details.component';

describe('BosUserProjectDetailsComponent', () => {
  let component: BosUserProjectDetailsComponent;
  let fixture: ComponentFixture<BosUserProjectDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BosUserProjectDetailsComponent]
    });
    fixture = TestBed.createComponent(BosUserProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
