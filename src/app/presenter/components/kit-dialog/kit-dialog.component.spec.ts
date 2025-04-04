import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitDialogComponent } from './kit-dialog.component';

describe('KitDialogComponent', () => {
  let component: KitDialogComponent;
  let fixture: ComponentFixture<KitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
