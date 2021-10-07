import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptAttachEnergyComponent } from './prompt-attach-energy.component';

describe('PromptAttachEnergyComponent', () => {
  let component: PromptAttachEnergyComponent;
  let fixture: ComponentFixture<PromptAttachEnergyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptAttachEnergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptAttachEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
