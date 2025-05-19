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
    component.value = 'Attach a G Energy card to your Pokemon EX.';
    expect(component.items).toEqual([
      { text: 'Attach a ' },
      { text: '', icon: 'grass' },
      { text: ' Energy card to your Pokemon ' },
      { text: '', icon: 'ex' },
      { text: '.' }
    ]);
  });
});
