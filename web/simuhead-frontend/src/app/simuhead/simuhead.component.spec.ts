import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuheadComponent } from './simuhead.component';

describe('SimuheadComponent', () => {
  let component: SimuheadComponent;
  let fixture: ComponentFixture<SimuheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimuheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
