import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAvatarPopupComponent } from './choose-avatar-popup.component';

describe('ChooseAvatarPopupComponent', () => {
  let component: ChooseAvatarPopupComponent;
  let fixture: ComponentFixture<ChooseAvatarPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseAvatarPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAvatarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
