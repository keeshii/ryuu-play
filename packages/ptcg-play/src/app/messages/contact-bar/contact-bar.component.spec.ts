import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactBarComponent } from './contact-bar.component';

describe('ContactBarComponent', () => {
  let component: ContactBarComponent;
  let fixture: ComponentFixture<ContactBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
