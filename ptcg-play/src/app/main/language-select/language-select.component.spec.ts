import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSelectComponent } from './language-select.component';

describe('LanguageSelectComponent', () => {
  let component: LanguageSelectComponent;
  let fixture: ComponentFixture<LanguageSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
