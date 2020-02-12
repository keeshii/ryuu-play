import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputNumberPopupComponent } from './input-number-popup.component';

describe('InputNumberPopupComponent', () => {
  let component: InputNumberPopupComponent;
  let fixture: ComponentFixture<InputNumberPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputNumberPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputNumberPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
