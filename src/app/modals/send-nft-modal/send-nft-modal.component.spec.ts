import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNftModalComponent } from './send-nft-modal.component';

describe('SendNftModalComponent', () => {
  let component: SendNftModalComponent;
  let fixture: ComponentFixture<SendNftModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendNftModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendNftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
