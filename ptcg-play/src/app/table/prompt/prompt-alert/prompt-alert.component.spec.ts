import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptAlertComponent } from './prompt-alert.component';

describe('PromptAlertComponent', () => {
  let component: PromptAlertComponent;
  let fixture: ComponentFixture<PromptAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
