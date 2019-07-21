import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaksComponent } from './paks.component';

describe('PaksComponent', () => {
  let component: PaksComponent;
  let fixture: ComponentFixture<PaksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
