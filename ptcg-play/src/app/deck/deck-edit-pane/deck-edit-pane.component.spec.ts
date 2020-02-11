import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditPaneComponent } from './deck-edit-pane.component';

describe('DeckEditPaneComponent', () => {
  let component: DeckEditPaneComponent;
  let fixture: ComponentFixture<DeckEditPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckEditPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckEditPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
