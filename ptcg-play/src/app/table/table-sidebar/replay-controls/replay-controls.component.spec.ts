import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayControlsComponent } from './replay-controls.component';

describe('ReplayControlsComponent', () => {
  let component: ReplayControlsComponent;
  let fixture: ComponentFixture<ReplayControlsComponent>;

  beforeEach(async(() => {
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
