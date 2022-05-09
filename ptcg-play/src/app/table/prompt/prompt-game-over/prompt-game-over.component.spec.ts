import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameWinner } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { GameOverPrompt } from './game-over.prompt';
import { PromptGameOverComponent } from './prompt-game-over.component';

describe('PromptGameOverComponent', () => {
  let component: PromptGameOverComponent;
  let fixture: ComponentFixture<PromptGameOverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptGameOverComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptGameOverComponent);
    component = fixture.componentInstance;
    component.prompt = new GameOverPrompt(1, GameWinner.NONE);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
