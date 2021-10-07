import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportReplayPopupComponent } from './import-replay-popup.component';

describe('ImportReplayPopupComponent', () => {
  let component: ImportReplayPopupComponent;
  let fixture: ComponentFixture<ImportReplayPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportReplayPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportReplayPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
