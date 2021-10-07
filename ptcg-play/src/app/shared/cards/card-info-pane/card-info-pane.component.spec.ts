import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardInfoPaneComponent } from './card-info-pane.component';

describe('CardInfoPaneComponent', () => {
  let component: CardInfoPaneComponent;
  let fixture: ComponentFixture<CardInfoPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
