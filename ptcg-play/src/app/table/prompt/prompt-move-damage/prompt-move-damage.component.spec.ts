import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptMoveDamageComponent } from './prompt-move-damage.component';

describe('PromptMoveDamageComponent', () => {
  let component: PromptMoveDamageComponent;
  let fixture: ComponentFixture<PromptMoveDamageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptMoveDamageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptMoveDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
