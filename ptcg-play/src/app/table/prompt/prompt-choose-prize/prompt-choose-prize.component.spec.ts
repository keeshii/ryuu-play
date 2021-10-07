import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptChoosePrizeComponent } from './prompt-choose-prize.component';

describe('PromptChoosePrizeComponent', () => {
  let component: PromptChoosePrizeComponent;
  let fixture: ComponentFixture<PromptChoosePrizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptChoosePrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChoosePrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
