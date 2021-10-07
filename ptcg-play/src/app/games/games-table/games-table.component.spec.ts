import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GamesTableComponent } from './games-table.component';

describe('GamesTableComponent', () => {
  let component: GamesTableComponent;
  let fixture: ComponentFixture<GamesTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
