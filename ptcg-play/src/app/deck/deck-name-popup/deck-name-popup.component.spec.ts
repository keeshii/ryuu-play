import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckNamePopupComponent } from './deck-name-popup.component';

describe('DeckNamePopupComponent', () => {
  let component: DeckNamePopupComponent;
  let fixture: ComponentFixture<DeckNamePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckNamePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckNamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
