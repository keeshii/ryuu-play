import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndSortableModule } from '@ng-dnd/sortable';
import { TranslateModule } from '@ngx-translate/core';
import { TestBackend } from 'react-dnd-test-backend';

import { ApiModule } from '../../api/api.module';
import { AlertModule } from '../../shared/alert/alert.module';
import { CardsModule } from '../../shared/cards/cards.module';
import { DeckEditPanesComponent } from './deck-edit-panes.component';
import { FilterCardsPipe } from '../deck-edit-toolbar/filter-cards.pipe';

describe('DeckEditPaneComponent', () => {
  let component: DeckEditPanesComponent;
  let fixture: ComponentFixture<DeckEditPanesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        AlertModule,
        CardsModule,
        DndModule.forRoot({ backend: TestBackend }),
        DndSortableModule,
        TranslateModule.forRoot()
      ],
      declarations: [ DeckEditPanesComponent, FilterCardsPipe ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
