import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MatchTableComponent } from './match-table.component';

describe('MatchTableComponent', () => {
  let component: MatchTableComponent;
  let fixture: ComponentFixture<MatchTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
