import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardActiveComponent } from './board-active.component';

describe('BoardActiveComponent', () => {
  let component: BoardActiveComponent;
  let fixture: ComponentFixture<BoardActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
