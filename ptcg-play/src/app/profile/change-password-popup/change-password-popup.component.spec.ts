import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPopupComponent } from './change-password-popup.component';

describe('ChangePasswordPopupComponent', () => {
  let component: ChangePasswordPopupComponent;
  let fixture: ComponentFixture<ChangePasswordPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
