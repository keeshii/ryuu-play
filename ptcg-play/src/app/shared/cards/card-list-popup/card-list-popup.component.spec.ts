import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListPopupComponent } from './card-list-popup.component';

describe('CardListPopupComponent', () => {
  let component: CardListPopupComponent;
  let fixture: ComponentFixture<CardListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
