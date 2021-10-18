import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptConfirmComponent } from './prompt-confirm.component';

describe('PromptConfirmComponent', () => {
  let component: PromptConfirmComponent;
  let fixture: ComponentFixture<PromptConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
            imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptConfirmComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptConfirmComponent);
    component = fixture.componentInstance;
    component.prompt = new ConfirmPrompt(1, GameMessage.COIN_FLIP);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
