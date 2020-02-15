import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditPanesComponent } from './deck-edit-panes.component';

describe('DeckEditPaneComponent', () => {
  let component: DeckEditPanesComponent;
  let fixture: ComponentFixture<DeckEditPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckEditPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckEditPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
