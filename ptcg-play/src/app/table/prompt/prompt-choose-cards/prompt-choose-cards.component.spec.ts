import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptChooseCardsComponent } from './prompt-choose-cards.component';

describe('PromptChooseCardsComponent', () => {
  let component: PromptChooseCardsComponent;
  let fixture: ComponentFixture<PromptChooseCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptChooseCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
