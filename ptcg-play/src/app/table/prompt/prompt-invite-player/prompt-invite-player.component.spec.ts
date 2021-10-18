import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InvitePlayerPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptInvitePlayerComponent } from './prompt-invite-player.component';

describe('PromptInvitePlayerComponent', () => {
  let component: PromptInvitePlayerComponent;
  let fixture: ComponentFixture<PromptInvitePlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
            imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptInvitePlayerComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptInvitePlayerComponent);
    component = fixture.componentInstance;
    component.prompt = new InvitePlayerPrompt(1, GameMessage.COIN_FLIP);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
