import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTextComponent } from './card-text.component';

describe('CardTextComponent', () => {
  let component: CardTextComponent;
  let fixture: ComponentFixture<CardTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardTextComponent]
    });
    fixture = TestBed.createComponent(CardTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should decode card symbols', () => {
    component.value = 'Attach a G Energy card from Unown !R to Pokemon EX.';
    expect(component.items).toEqual([
      { text: 'Attach a ' },
      { text: '', icon: 'grass' },
      { text: ' Energy card from Unown R to Pokemon ' },
      { text: '', icon: 'ex' },
      { text: '.' }
    ]);
  });

  it('should decode card names', () => {
    component.value = '!N';
    expect(component.items).toEqual([{ text: 'N' }]);

    component.value = 'Unown !R';
    expect(component.items).toEqual([{ text: 'Unown R' }]);

    component.value = 'Shaymin EX';
    expect(component.items).toEqual([
      { text: 'Shaymin ' },
      { text: '', icon: 'ex' },]
    );
  });

  it('should decode empty value', () => {
    component.value = undefined;
    expect(component.items).toEqual([]);
  });

});
