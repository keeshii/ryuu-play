import { EMPTY } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { GameService } from './api/services/game.service';
import { LoginPopupService } from './shared/login-popup/login-popup.service';
import { MaterialModule } from './shared/material.module';
import { SessionService } from './shared/session/session.service';
import { SocketService } from './api/socket.service';

class SessionServiceMock {
  public get() { return EMPTY }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: LoginPopupService, useValue: {} },
        { provide: GameService, useValue: {} },
        { provide: SessionService, useClass: SessionServiceMock },
        { provide: SocketService, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
