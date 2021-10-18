import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChooseAttackPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptChooseAttackComponent } from './prompt-choose-attack.component';

describe('PromptChooseAttackComponent', () => {
  let component: PromptChooseAttackComponent;
  let fixture: ComponentFixture<PromptChooseAttackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptChooseAttackComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseAttackComponent);
    component = fixture.componentInstance;
    component.prompt = new ChooseAttackPrompt(1, GameMessage.COIN_FLIP, []);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
