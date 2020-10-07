import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoPaneComponent } from './card-info-pane.component';

describe('CardInfoPaneComponent', () => {
  let component: CardInfoPaneComponent;
  let fixture: ComponentFixture<CardInfoPaneComponent>;

  beforeEach(async(() => {
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
