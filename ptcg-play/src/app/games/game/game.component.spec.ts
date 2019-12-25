import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';

import { GameComponent } from './game.component';
import { GameService } from 'src/app/api/services/game.service';

class GameServiceMock {
  gameStates$ = EMPTY;
}

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GameService, useClass: GameServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
