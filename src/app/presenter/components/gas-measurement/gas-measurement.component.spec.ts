import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasMeasurementComponent } from './gas-measurement.component';

describe('GasMeasurementComponent', () => {
  let component: GasMeasurementComponent;
  let fixture: ComponentFixture<GasMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasMeasurementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
