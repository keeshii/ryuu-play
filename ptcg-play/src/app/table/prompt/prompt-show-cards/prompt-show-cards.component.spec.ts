import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptShowCardsComponent } from './prompt-show-cards.component';

describe('PromptShowCardsComponent', () => {
  let component: PromptShowCardsComponent;
  let fixture: ComponentFixture<PromptShowCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptShowCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptShowCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
