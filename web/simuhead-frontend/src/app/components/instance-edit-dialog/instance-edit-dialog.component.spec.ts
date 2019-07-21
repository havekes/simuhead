import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceEditDialogComponent } from './instance-edit-dialog.component';

describe('InstanceEditDialogComponent', () => {
  let component: InstanceEditDialogComponent;
  let fixture: ComponentFixture<InstanceEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
