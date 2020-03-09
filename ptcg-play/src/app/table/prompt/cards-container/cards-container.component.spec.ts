import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsContainerComponent } from './cards-container.component';

describe('CardsContainerComponent', () => {
  let component: CardsContainerComponent;
  let fixture: ComponentFixture<CardsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
