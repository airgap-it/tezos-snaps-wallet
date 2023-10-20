import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTokenModalComponent } from './send-token-modal.component';

describe('SendTokenModalComponent', () => {
  let component: SendTokenModalComponent;
  let fixture: ComponentFixture<SendTokenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendTokenModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
