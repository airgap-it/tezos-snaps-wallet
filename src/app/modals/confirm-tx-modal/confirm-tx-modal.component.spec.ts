import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTxModalComponent } from './confirm-tx-modal.component';

describe('ConfirmTxModalComponent', () => {
  let component: ConfirmTxModalComponent;
  let fixture: ComponentFixture<ConfirmTxModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmTxModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
