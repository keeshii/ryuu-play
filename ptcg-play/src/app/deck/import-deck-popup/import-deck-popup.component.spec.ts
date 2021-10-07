import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportDeckPopupComponent } from './import-deck-popup.component';

describe('ImportDeckPopupComponent', () => {
  let component: ImportDeckPopupComponent;
  let fixture: ComponentFixture<ImportDeckPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDeckPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDeckPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
