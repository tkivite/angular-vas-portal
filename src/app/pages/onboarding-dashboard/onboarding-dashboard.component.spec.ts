import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingDashboardComponent } from './onboarding-dashboard.component';

describe('OnboardingDashboardComponent', () => {
  let component: OnboardingDashboardComponent;
  let fixture: ComponentFixture<OnboardingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
