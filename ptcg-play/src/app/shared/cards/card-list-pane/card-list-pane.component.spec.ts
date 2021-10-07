import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardListPaneComponent } from './card-list-pane.component';

describe('CardListPaneComponent', () => {
  let component: CardListPaneComponent;
  let fixture: ComponentFixture<CardListPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardListPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardListPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
