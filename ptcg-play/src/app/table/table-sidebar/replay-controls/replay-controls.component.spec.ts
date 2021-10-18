import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../../api/api.module';
import { ReplayControlsComponent } from './replay-controls.component';

describe('ReplayControlsComponent', () => {
  let component: ReplayControlsComponent;
  let fixture: ComponentFixture<ReplayControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        MatButtonModule,
        TranslateModule.forRoot()
      ],
      declarations: [ ReplayControlsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
