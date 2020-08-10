import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptInvitePlayerComponent } from './prompt-invite-player.component';

describe('PromptInvitePlayerComponent', () => {
  let component: PromptInvitePlayerComponent;
  let fixture: ComponentFixture<PromptInvitePlayerComponent>;

  beforeEach(async(() => {
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
