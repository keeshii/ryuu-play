import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { TranslateModule } from '@ngx-translate/core';
import { TestBackend } from 'react-dnd-test-backend';

import { ApiModule } from '../../api/api.module';
import { CardsModule } from '../../shared/cards/cards.module';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        CardsModule,
        DndModule.forRoot({ backend: TestBackend }),
        TranslateModule.forRoot()
      ],
      declarations: [ BoardComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    component.gameState = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
