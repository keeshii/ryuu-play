import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableSidebarComponent } from './table-sidebar.component';

describe('TableSidebarComponent', () => {
  let component: TableSidebarComponent;
  let fixture: ComponentFixture<TableSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
