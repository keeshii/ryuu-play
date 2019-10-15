import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { LoginPopupService } from './shared/login-popup/login-popup.service';

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
        { provide: LoginPopupService, useValue: {} }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
