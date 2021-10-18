import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CardInfoPaneComponent } from './card-info-pane.component';

describe('CardInfoPaneComponent', () => {
  let component: CardInfoPaneComponent;
  let fixture: ComponentFixture<CardInfoPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoPaneComponent ],
      providers: [
        { provide: MatDialog, useValue: {} }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoPaneComponent);
    component = fixture.componentInstance;
    component.card = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
