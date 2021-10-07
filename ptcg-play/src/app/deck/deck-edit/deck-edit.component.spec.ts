import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckEditComponent } from './deck-edit.component';

describe('DeckEditComponent', () => {
  let component: DeckEditComponent;
  let fixture: ComponentFixture<DeckEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeckEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
