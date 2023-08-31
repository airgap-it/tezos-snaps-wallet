import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConnectedModalComponent } from './not-connected-modal.component';

describe('NotConnectedModalComponent', () => {
  let component: NotConnectedModalComponent;
  let fixture: ComponentFixture<NotConnectedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotConnectedModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
