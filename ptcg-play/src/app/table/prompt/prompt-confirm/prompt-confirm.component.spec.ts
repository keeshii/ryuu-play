import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptConfirmComponent } from './prompt-confirm.component';

describe('PromptConfirmComponent', () => {
  let component: PromptConfirmComponent;
  let fixture: ComponentFixture<PromptConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
