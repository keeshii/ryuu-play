import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DropHighlightDirective } from '../drop-highlight/drop-highlight.directive';
import { HoverHighlightComponent } from './hover-highlight.component';

describe('HoverHighlightComponent', () => {
  let component: HoverHighlightComponent;
  let fixture: ComponentFixture<HoverHighlightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DropHighlightDirective, HoverHighlightComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
