import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoPopupComponent } from './card-info-popup.component';

describe('CardInfoPopupComponent', () => {
  let component: CardInfoPopupComponent;
  let fixture: ComponentFixture<CardInfoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
