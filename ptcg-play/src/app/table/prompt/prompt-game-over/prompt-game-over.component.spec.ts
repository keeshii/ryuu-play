import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptGameOverComponent } from './prompt-game-over.component';

describe('PromptGameOverComponent', () => {
  let component: PromptGameOverComponent;
  let fixture: ComponentFixture<PromptGameOverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptGameOverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptGameOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
