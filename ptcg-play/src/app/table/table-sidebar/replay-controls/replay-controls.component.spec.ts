import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplayControlsComponent } from './replay-controls.component';

describe('ReplayControlsComponent', () => {
  let component: ReplayControlsComponent;
  let fixture: ComponentFixture<ReplayControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplayControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
