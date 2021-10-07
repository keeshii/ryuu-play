import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserInfoPaneComponent } from './user-info-pane.component';

describe('UserInfoPaneComponent', () => {
  let component: UserInfoPaneComponent;
  let fixture: ComponentFixture<UserInfoPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInfoPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
