import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { TranslateModule } from '@ngx-translate/core';
import { TestBackend } from 'react-dnd-test-backend';

import { ApiModule } from '../../../api/api.module';
import { ChoosePokemonsPaneComponent } from './choose-pokemons-pane.component';

describe('ChoosePokemonsPaneComponent', () => {
  let component: ChoosePokemonsPaneComponent;
  let fixture: ComponentFixture<ChoosePokemonsPaneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        DndModule.forRoot({ backend: TestBackend }),
        TranslateModule.forRoot()
      ],
      declarations: [ ChoosePokemonsPaneComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePokemonsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
