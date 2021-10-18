import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChooseEnergyPrompt, GameMessage } from 'ptcg-server';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptChooseEnergyComponent } from './prompt-choose-energy.component';

describe('PromptChooseEnergyComponent', () => {
  let component: PromptChooseEnergyComponent;
  let fixture: ComponentFixture<PromptChooseEnergyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
            imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptChooseEnergyComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseEnergyComponent);
    component = fixture.componentInstance;
    component.prompt = new ChooseEnergyPrompt(1, GameMessage.COIN_FLIP, [], []);
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
