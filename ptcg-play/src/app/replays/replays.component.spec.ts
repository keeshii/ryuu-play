import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaysComponent } from './replays.component';

describe('ReplaysComponent', () => {
  let component: ReplaysComponent;
  let fixture: ComponentFixture<ReplaysComponent>;

  beforeEach(async(() => {
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
