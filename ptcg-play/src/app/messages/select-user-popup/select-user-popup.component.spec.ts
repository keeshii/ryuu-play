import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserPopupComponent } from './select-user-popup.component';

describe('SelectUserPopupComponent', () => {
  let component: SelectUserPopupComponent;
  let fixture: ComponentFixture<SelectUserPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUserPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
