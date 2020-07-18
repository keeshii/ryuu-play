import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptOrderCardsComponent } from './prompt-order-cards.component';

describe('PromptOrderCardsComponent', () => {
  let component: PromptOrderCardsComponent;
  let fixture: ComponentFixture<PromptOrderCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptOrderCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptOrderCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
