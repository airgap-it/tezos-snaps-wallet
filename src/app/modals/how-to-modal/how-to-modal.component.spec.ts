import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToModalComponent } from './how-to-modal.component';

describe('HowToModalComponent', () => {
  let component: HowToModalComponent;
  let fixture: ComponentFixture<HowToModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowToModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
