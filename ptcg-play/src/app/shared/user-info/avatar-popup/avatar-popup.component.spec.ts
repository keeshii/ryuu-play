import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPopupComponent } from './avatar-popup.component';

describe('AvatarPopupComponent', () => {
  let component: AvatarPopupComponent;
  let fixture: ComponentFixture<AvatarPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
