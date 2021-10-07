import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAvatarPopupComponent } from './add-avatar-popup.component';

describe('AddAvatarPopupComponent', () => {
  let component: AddAvatarPopupComponent;
  let fixture: ComponentFixture<AddAvatarPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAvatarPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAvatarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
