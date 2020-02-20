import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardBenchComponent } from './board-bench.component';

describe('BoardBenchComponent', () => {
  let component: BoardBenchComponent;
  let fixture: ComponentFixture<BoardBenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardBenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardBenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
