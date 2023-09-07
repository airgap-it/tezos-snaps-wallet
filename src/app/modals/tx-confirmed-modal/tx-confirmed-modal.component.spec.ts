import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxConfirmedModalComponent } from './tx-confirmed-modal.component';

describe('TxConfirmedModalComponent', () => {
  let component: TxConfirmedModalComponent;
  let fixture: ComponentFixture<TxConfirmedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TxConfirmedModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxConfirmedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
