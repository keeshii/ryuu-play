import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ApiModule } from '../../api/api.module';
import { AlertModule } from '../../shared/alert/alert.module';
import { SidenavItemComponent } from './sidenav-item.component';

describe('SidenavItemComponent', () => {
  let component: SidenavItemComponent;
  let fixture: ComponentFixture<SidenavItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ApiModule,
        AlertModule,
        MatBadgeModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ SidenavItemComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
