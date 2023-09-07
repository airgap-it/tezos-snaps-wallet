import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTezModalComponent } from './send-tez-modal.component';

describe('SendTezModalComponent', () => {
  let component: SendTezModalComponent;
  let fixture: ComponentFixture<SendTezModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendTezModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTezModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
