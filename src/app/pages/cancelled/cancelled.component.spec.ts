import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CancelledComponent } from "./cancelled.component";

describe("CancelledComponent", () => {
  let component: CancelledComponent;
  let fixture: ComponentFixture<CancelledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelledComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
