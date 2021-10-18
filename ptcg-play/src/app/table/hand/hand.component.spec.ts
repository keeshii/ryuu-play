import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndSortableModule } from '@ng-dnd/sortable';
import { TranslateModule } from '@ngx-translate/core';
import { TestBackend } from 'react-dnd-test-backend';

import { ApiModule } from '../../api/api.module';
import { HandComponent } from './hand.component';

describe('HandComponent', () => {
  let component: HandComponent;
  let fixture: ComponentFixture<HandComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        DndModule.forRoot({ backend: TestBackend }),
        DndSortableModule,
        TranslateModule.forRoot()
      ],
      declarations: [ HandComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
