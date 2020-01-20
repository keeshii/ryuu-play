import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameActionsComponent } from './game-actions.component';

describe('GameActionsComponent', () => {
  let component: GameActionsComponent;
  let fixture: ComponentFixture<GameActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
