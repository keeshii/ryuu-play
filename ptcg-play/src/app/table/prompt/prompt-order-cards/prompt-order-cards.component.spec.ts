import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CardList, GameMessage, OrderCardsPrompt } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptOrderCardsComponent } from './prompt-order-cards.component';

describe('PromptOrderCardsComponent', () => {
  let component: PromptOrderCardsComponent;
  let fixture: ComponentFixture<PromptOrderCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptOrderCardsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptOrderCardsComponent);
    component = fixture.componentInstance;
    component.prompt = new OrderCardsPrompt(1, GameMessage.COIN_FLIP, new CardList());
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
