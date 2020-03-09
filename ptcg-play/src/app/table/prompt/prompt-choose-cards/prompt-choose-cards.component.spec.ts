import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptChooseCardsComponent } from './prompt-choose-cards.component';

describe('PromptChooseCardsComponent', () => {
  let component: PromptChooseCardsComponent;
  let fixture: ComponentFixture<PromptChooseCardsComponent>;

  beforeEach(async(() => {
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
