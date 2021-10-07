import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckCardComponent } from './deck-card.component';

describe('DraggableDeckCardComponent', () => {
  let component: DeckCardComponent;
  let fixture: ComponentFixture<DeckCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
