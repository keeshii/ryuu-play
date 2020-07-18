import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePokemonsPaneComponent } from './choose-pokemons-pane.component';

describe('ChoosePokemonsPaneComponent', () => {
  let component: ChoosePokemonsPaneComponent;
  let fixture: ComponentFixture<ChoosePokemonsPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePokemonsPaneComponent ]
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
