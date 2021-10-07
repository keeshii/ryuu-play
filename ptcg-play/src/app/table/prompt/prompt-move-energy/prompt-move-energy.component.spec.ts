import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptMoveEnergyComponent } from './prompt-move-energy.component';

describe('PromptMoveEnergyComponent', () => {
  let component: PromptMoveEnergyComponent;
  let fixture: ComponentFixture<PromptMoveEnergyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptMoveEnergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptMoveEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
