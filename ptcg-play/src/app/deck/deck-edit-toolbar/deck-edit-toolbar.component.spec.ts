import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckEditToolbarComponent } from './deck-edit-toolbar.component';

describe('DeckEditToolbarComponent', () => {
  let component: DeckEditToolbarComponent;
  let fixture: ComponentFixture<DeckEditToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckEditToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckEditToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
