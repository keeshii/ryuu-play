import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptChoosePrizeComponent } from './prompt-choose-prize.component';

describe('PromptChoosePrizeComponent', () => {
  let component: PromptChoosePrizeComponent;
  let fixture: ComponentFixture<PromptChoosePrizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
            imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptChoosePrizeComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChoosePrizeComponent);
    component = fixture.componentInstance;
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
