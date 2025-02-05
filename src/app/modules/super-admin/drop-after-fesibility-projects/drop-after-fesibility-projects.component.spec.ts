import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropAfterFesibilityProjectsComponent } from './drop-after-fesibility-projects.component';

describe('DropAfterFesibilityProjectsComponent', () => {
  let component: DropAfterFesibilityProjectsComponent;
  let fixture: ComponentFixture<DropAfterFesibilityProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropAfterFesibilityProjectsComponent]
    });
    fixture = TestBed.createComponent(DropAfterFesibilityProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
