import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardPrizesComponent } from './board-prizes.component';

describe('BoardPrizesComponent', () => {
  let component: BoardPrizesComponent;
  let fixture: ComponentFixture<BoardPrizesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardPrizesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
