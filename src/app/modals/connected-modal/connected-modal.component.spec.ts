import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedModalComponent } from './connected-modal.component';

describe('ConnectedModalComponent', () => {
  let component: ConnectedModalComponent;
  let fixture: ComponentFixture<ConnectedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectedModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
