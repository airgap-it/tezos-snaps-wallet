import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftModalComponent } from './nft-modal.component';

describe('NftModalComponent', () => {
  let component: NftModalComponent;
  let fixture: ComponentFixture<NftModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
