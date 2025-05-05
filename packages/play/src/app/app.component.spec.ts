import { EMPTY } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AlertModule } from './shared/alert/alert.module';
import { AppComponent } from './app.component';
import { GameService } from './api/services/game.service';
import { LoginService } from './api/services/login.service';
import { MaterialModule } from './shared/material.module';
import { SessionService } from './shared/session/session.service';
import { SocketService } from './api/socket.service';

class SessionServiceMock {
  public get() { return EMPTY; }
}

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AlertModule,
        MaterialModule,
        NoopAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: GameService, useValue: {} },
        { provide: LoginService, useValue: {} },
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
