import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsSelectionComponent } from './accounts-selection.component';

describe('AccountsSelectionComponent', () => {
  let component: AccountsSelectionComponent;
  let fixture: ComponentFixture<AccountsSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
