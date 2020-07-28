import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSelectComponent } from './prompt-select.component';

describe('PromptSelectComponent', () => {
  let component: PromptSelectComponent;
  let fixture: ComponentFixture<PromptSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
