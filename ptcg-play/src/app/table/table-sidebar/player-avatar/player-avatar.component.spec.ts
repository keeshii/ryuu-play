import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerAvatarComponent } from './player-avatar.component';

describe('PlayerAvatarComponent', () => {
  let component: PlayerAvatarComponent;
  let fixture: ComponentFixture<PlayerAvatarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
