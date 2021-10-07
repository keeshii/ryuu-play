import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameLogsComponent } from './game-logs.component';

describe('GameLogsComponent', () => {
  let component: GameLogsComponent;
  let fixture: ComponentFixture<GameLogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
