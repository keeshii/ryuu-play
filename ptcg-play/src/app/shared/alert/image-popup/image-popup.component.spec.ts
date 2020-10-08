import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePopupComponent } from './image-popup.component';

describe('ImagePopupComponent', () => {
  let component: ImagePopupComponent;
  let fixture: ComponentFixture<ImagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
