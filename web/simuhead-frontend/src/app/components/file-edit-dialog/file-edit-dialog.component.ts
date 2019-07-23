import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {ApiService, FileInfo} from '../../api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-file-edit-dialog',
  templateUrl: './file-edit-dialog.component.html',
  styleUrls: ['./file-edit-dialog.component.sass']
})
export class FileEditDialogComponent {

  private edited = false;
  private fileForm = new FormGroup({
    name: new FormControl(this.data.file.name),
    version: new FormControl(this.data.file.version),
  });
  private file: File;

  constructor(public dialogRef: MatDialogRef<FileEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FileData,
              private confirmDialog: MatDialog,
              private apiService: ApiService) {
    this.fileForm.valueChanges.subscribe(() => {
      this.edited = true;
      console.log(this.fileForm);
    });
  }

  onFileChange(files: FileList) {
    this.file = files[0];
  }

  /**
   * Check for edits and close the dialog
   */
  closeConfirm(prompt: string) {
    if (this.edited) {
      // If the content has been edited, open a confirm dialog before closing
      let confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
        data: prompt,
      });
      confirmDialogRef.afterClosed().subscribe((answer) => {
        if (answer) {
          this.dialogRef.close();
        }
      });
    } else {
      // If not edit has been made, just close the dialog
      this.dialogRef.close();
    }
  }

  save() {
    if (this.data.new) {
      let fileData = new FormData();
      fileData.append('name', this.fileForm.value.name);
      fileData.append('version', this.fileForm.value.version);
      fileData.append('file', this.file);

      // TODO: choose between pak and save
      this.apiService.pakPost(fileData).subscribe({
        error: err => {
          console.log(err);
        },
        complete: () => {
          this.dialogRef.close(fileData);
        }
      });
    }
  }
}

interface FileData {
  file: FileInfo;
  new?: boolean;
}
