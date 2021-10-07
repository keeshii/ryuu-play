import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptAlertComponent } from './prompt-alert.component';

describe('PromptAlertComponent', () => {
  let component: PromptAlertComponent;
  let fixture: ComponentFixture<PromptAlertComponent>;

  beforeEach(waitForAsync(() => {
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
