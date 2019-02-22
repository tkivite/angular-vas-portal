import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessentityComponent } from './businessentity.component';

describe('BusinessentityComponent', () => {
  let component: BusinessentityComponent;
  let fixture: ComponentFixture<BusinessentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessentityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
