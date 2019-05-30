import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMenuComponent } from './sales-menu.component';

describe('SalesMenuComponent', () => {
  let component: SalesMenuComponent;
  let fixture: ComponentFixture<SalesMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
