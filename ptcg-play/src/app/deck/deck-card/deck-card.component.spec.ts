import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Card } from 'ptcg-server';

import { DeckCardComponent } from './deck-card.component';

describe('DeckCardComponent', () => {
  let component: DeckCardComponent;
  let fixture: ComponentFixture<DeckCardComponent>;
  let card: Card;

  beforeEach(waitForAsync(() => {
    card = { fullName: 'Name' } as any;

    TestBed.configureTestingModule({
      declarations: [ DeckCardComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckCardComponent);
    component = fixture.componentInstance;
    component.card = { card, count: 1, pane: null, scanUrl: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
