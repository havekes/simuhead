import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileEditDialogComponent } from './file-edit-dialog.component';

describe('FileEditDialogComponent', () => {
  let component: FileEditDialogComponent;
  let fixture: ComponentFixture<FileEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
