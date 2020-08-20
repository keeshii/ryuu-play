import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNamePopupComponent } from './input-name-popup.component';

describe('InputNamePopupComponent', () => {
  let component: InputNamePopupComponent;
  let fixture: ComponentFixture<InputNamePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputNamePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNamePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
