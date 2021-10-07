import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeServerPopupComponent } from './change-server-popup.component';

describe('ChangeServerPopupComponent', () => {
  let component: ChangeServerPopupComponent;
  let fixture: ComponentFixture<ChangeServerPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeServerPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeServerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
