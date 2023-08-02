import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationModalComponent } from './operation-modal.component';

describe('OperationModalComponent', () => {
  let component: OperationModalComponent;
  let fixture: ComponentFixture<OperationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
