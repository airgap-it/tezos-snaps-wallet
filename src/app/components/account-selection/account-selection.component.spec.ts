import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectionComponent } from './account-selection.component';

describe('AccountSelectionComponent', () => {
  let component: AccountSelectionComponent;
  let fixture: ComponentFixture<AccountSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
