import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeEmailPopupComponent } from './change-email-popup.component';

describe('ChangeEmailPopupComponent', () => {
  let component: ChangeEmailPopupComponent;
  let fixture: ComponentFixture<ChangeEmailPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeEmailPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
