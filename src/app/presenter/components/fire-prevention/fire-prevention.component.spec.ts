import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirePreventionComponent } from './fire-prevention.component';

describe('FirePreventionComponent', () => {
  let component: FirePreventionComponent;
  let fixture: ComponentFixture<FirePreventionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirePreventionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirePreventionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
