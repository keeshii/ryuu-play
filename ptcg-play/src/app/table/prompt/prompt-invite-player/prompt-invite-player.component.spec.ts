import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptInvitePlayerComponent } from './prompt-invite-player.component';

describe('PromptInvitePlayerComponent', () => {
  let component: PromptInvitePlayerComponent;
  let fixture: ComponentFixture<PromptInvitePlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptInvitePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptInvitePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
