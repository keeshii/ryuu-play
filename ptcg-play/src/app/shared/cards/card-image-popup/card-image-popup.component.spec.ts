import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardImagePopupComponent } from './card-image-popup.component';

describe('CardImagePopupComponent', () => {
  let component: CardImagePopupComponent;
  let fixture: ComponentFixture<CardImagePopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardImagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
