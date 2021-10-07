import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptChooseAttackComponent } from './prompt-choose-attack.component';

describe('PromptChooseAttackComponent', () => {
  let component: PromptChooseAttackComponent;
  let fixture: ComponentFixture<PromptChooseAttackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptChooseAttackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseAttackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
