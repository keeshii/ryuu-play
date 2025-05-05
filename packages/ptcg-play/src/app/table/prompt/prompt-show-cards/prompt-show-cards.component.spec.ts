import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameMessage, ShowCardsPrompt } from '@ryuu-play/ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptShowCardsComponent } from './prompt-show-cards.component';

describe('PromptShowCardsComponent', () => {
  let component: PromptShowCardsComponent;
  let fixture: ComponentFixture<PromptShowCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptShowCardsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptShowCardsComponent);
    component = fixture.componentInstance;
    component.prompt = new ShowCardsPrompt(1, GameMessage.COIN_FLIP, []);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
