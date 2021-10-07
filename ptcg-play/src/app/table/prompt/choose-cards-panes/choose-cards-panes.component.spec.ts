import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseCardsPanesComponent } from './choose-cards-panes.component';

describe('ChooseCardsPanesComponent', () => {
  let component: ChooseCardsPanesComponent;
  let fixture: ComponentFixture<ChooseCardsPanesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseCardsPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseCardsPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
