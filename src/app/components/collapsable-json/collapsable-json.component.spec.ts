import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsableJsonComponent } from './collapsable-json.component';

describe('CollapsableJsonComponent', () => {
  let component: CollapsableJsonComponent;
  let fixture: ComponentFixture<CollapsableJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapsableJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsableJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
