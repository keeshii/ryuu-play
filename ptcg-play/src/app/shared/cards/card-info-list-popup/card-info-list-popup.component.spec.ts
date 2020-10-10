import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoListPopupComponent } from './card-info-list-popup.component';

describe('CardInfoListPopupComponent', () => {
  let component: CardInfoListPopupComponent;
  let fixture: ComponentFixture<CardInfoListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
