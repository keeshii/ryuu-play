import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptAlertComponent } from './prompt-alert.component';

describe('PromptAlertComponent', () => {
  let component: PromptAlertComponent;
  let fixture: ComponentFixture<PromptAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptAlertComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptAlertComponent);
    component = fixture.componentInstance;
    component.prompt = new AlertPrompt(1, GameMessage.COIN_FLIP);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
