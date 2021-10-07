import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaysComponent } from './replays.component';

describe('ReplaysComponent', () => {
  let component: ReplaysComponent;
  let fixture: ComponentFixture<ReplaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
