import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSelectorModalComponent } from './node-selector-modal.component';

describe('NodeSelectorModalComponent', () => {
  let component: NodeSelectorModalComponent;
  let fixture: ComponentFixture<NodeSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeSelectorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
