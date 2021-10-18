import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptPutDamageComponent } from './prompt-put-damage.component';

describe('PromptPutDamageComponent', () => {
  let component: PromptPutDamageComponent;
  let fixture: ComponentFixture<PromptPutDamageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptPutDamageComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptPutDamageComponent);
    component = fixture.componentInstance;
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
