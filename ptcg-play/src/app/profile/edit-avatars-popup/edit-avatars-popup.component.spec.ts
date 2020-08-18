import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAvatarsPopupComponent } from './edit-avatars-popup.component';

describe('EditAvatarsPopupComponent', () => {
  let component: EditAvatarsPopupComponent;
  let fixture: ComponentFixture<EditAvatarsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAvatarsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAvatarsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
