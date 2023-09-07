import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPayloadModalComponent } from './sign-payload-modal.component';

describe('SignPayloadModalComponent', () => {
  let component: SignPayloadModalComponent;
  let fixture: ComponentFixture<SignPayloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignPayloadModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPayloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
