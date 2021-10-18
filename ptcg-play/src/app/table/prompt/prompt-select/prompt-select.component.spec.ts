import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { PromptSelectComponent } from './prompt-select.component';

describe('PromptSelectComponent', () => {
  let component: PromptSelectComponent;
  let fixture: ComponentFixture<PromptSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        FormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [ PromptSelectComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptSelectComponent);
    component = fixture.componentInstance;
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
