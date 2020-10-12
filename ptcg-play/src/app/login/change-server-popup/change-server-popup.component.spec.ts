import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeServerPopupComponent } from './change-server-popup.component';

describe('ChangeServerPopupComponent', () => {
  let component: ChangeServerPopupComponent;
  let fixture: ComponentFixture<ChangeServerPopupComponent>;

  beforeEach(async(() => {
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
