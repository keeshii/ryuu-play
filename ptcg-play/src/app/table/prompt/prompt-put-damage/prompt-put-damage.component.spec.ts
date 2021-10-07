import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromptPutDamageComponent } from './prompt-put-damage.component';

describe('PromptPutDamageComponent', () => {
  let component: PromptPutDamageComponent;
  let fixture: ComponentFixture<PromptPutDamageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptPutDamageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptPutDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
