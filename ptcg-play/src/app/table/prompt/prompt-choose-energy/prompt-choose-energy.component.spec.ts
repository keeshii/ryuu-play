import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptChooseEnergyComponent } from './prompt-choose-energy.component';

describe('PromptChooseEnergyComponent', () => {
  let component: PromptChooseEnergyComponent;
  let fixture: ComponentFixture<PromptChooseEnergyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptChooseEnergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptChooseEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
