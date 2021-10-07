import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardDeckComponent } from './board-deck.component';

describe('BoardDeckComponent', () => {
  let component: BoardDeckComponent;
  let fixture: ComponentFixture<BoardDeckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
