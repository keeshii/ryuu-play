import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEntryComponent } from './message-entry.component';

describe('MessageEntryComponent', () => {
  let component: MessageEntryComponent;
  let fixture: ComponentFixture<MessageEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
