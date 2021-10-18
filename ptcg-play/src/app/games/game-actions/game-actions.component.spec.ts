import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { AlertModule } from '../../shared/alert/alert.module';
import { GameActionsComponent } from './game-actions.component';

describe('GameActionsComponent', () => {
  let component: GameActionsComponent;
  let fixture: ComponentFixture<GameActionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        AlertModule,
        TranslateModule.forRoot()
      ],
      declarations: [ GameActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
