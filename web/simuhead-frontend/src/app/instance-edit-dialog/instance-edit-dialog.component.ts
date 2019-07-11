import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Instance} from '../api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.sass']
})
export class InstanceEditDialogComponent {

  private edited = true;

  constructor(public dialogRef: MatDialogRef<InstanceEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public instance: Instance,
              private confirmDialog: MatDialog) {
  }

  /*
    Check for edits and close the dialog
   */
  closeConfirm(prompt) {
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
}
