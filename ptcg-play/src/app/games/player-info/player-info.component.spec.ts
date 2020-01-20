import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInfoComponent } from './player-info.component';

describe('PlayerInfoComponent', () => {
  let component: PlayerInfoComponent;
  let fixture: ComponentFixture<PlayerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
