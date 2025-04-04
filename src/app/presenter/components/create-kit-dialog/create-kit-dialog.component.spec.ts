import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateKitDialogComponent } from './create-kit-dialog.component';

describe('CreateKitDialogComponent', () => {
  let component: CreateKitDialogComponent;
  let fixture: ComponentFixture<CreateKitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateKitDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateKitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
