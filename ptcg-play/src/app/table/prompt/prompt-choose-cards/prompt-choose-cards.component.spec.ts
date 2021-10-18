import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CardList, ChooseCardsPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptChooseCardsComponent } from './prompt-choose-cards.component';

describe('PromptChooseCardsComponent', () => {
  let component: PromptChooseCardsComponent;
  let fixture: ComponentFixture<PromptChooseCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptChooseCardsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseCardsComponent);
    component = fixture.componentInstance;
    component.gameState = {} as any;
    component.prompt = new ChooseCardsPrompt(1, GameMessage.COIN_FLIP, new CardList(), {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
