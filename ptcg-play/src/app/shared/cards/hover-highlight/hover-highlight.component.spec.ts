import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverHighlightComponent } from './hover-highlight.component';

describe('HoverHighlightComponent', () => {
  let component: HoverHighlightComponent;
  let fixture: ComponentFixture<HoverHighlightComponent>;

  beforeEach(async(() => {
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
