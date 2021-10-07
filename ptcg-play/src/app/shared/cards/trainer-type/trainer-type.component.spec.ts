import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrainerTypeComponent } from './trainer-type.component';

describe('TrainerTypeComponent', () => {
  let component: TrainerTypeComponent;
  let fixture: ComponentFixture<TrainerTypeComponent>;

  beforeEach(waitForAsync(() => {
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
