import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerTypeComponent } from './trainer-type.component';

describe('TrainerTypeComponent', () => {
  let component: TrainerTypeComponent;
  let fixture: ComponentFixture<TrainerTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainerTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
