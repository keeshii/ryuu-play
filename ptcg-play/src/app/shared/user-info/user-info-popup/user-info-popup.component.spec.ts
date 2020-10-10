import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoPopupComponent } from './user-info-popup.component';

describe('UserInfoPopupComponent', () => {
  let component: UserInfoPopupComponent;
  let fixture: ComponentFixture<UserInfoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
