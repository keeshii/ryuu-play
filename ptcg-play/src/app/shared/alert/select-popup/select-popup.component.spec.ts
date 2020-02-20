import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPopupComponent } from './select-popup.component';

describe('InputNumberPopupComponent', () => {
  let component: SelectPopupComponent;
  let fixture: ComponentFixture<SelectPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
