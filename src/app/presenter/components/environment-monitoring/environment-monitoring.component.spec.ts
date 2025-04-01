import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentMonitoringComponent } from './environment-monitoring.component';

describe('EnvironmentMonitoringComponent', () => {
  let component: EnvironmentMonitoringComponent;
  let fixture: ComponentFixture<EnvironmentMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
