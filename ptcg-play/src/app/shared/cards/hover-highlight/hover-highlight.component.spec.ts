import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HoverHighlightComponent } from './hover-highlight.component';

describe('HoverHighlightComponent', () => {
  let component: HoverHighlightComponent;
  let fixture: ComponentFixture<HoverHighlightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HoverHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
