import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccountModalComponent } from './no-account-modal.component';

describe('NoAccountModalComponent', () => {
  let component: NoAccountModalComponent;
  let fixture: ComponentFixture<NoAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAccountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
