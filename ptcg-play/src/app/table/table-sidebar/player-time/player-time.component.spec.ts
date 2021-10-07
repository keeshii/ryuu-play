import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerTimeComponent } from './player-time.component';

describe('PlayerTimeComponent', () => {
  let component: PlayerTimeComponent;
  let fixture: ComponentFixture<PlayerTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
