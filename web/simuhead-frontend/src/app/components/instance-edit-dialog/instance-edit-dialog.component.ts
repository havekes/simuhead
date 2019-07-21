import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Instance, ApiService} from '../../api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.sass']
})
export class InstanceEditDialogComponent {

  constructor(public dialogRef: MatDialogRef<InstanceEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public instance: Instance,
              private confirmDialog: MatDialog,
              private apiService: ApiService) {
    this.instanceForm.valueChanges.subscribe((event) => {
      this.edited = true
    });
  }

  private edited = false;

  instanceForm = new FormGroup({
    name: new FormControl(this.instance.name),
    port: new FormControl(this.instance.port),
    revision: new FormControl(this.instance.revision),
    lang: new FormControl(this.instance.lang)
  });

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

  /**
   * Save values to the API
   * TODO quick hack, definitely not sure this is the best way to do that
   */
  save() {
    const instance: Instance = {
      name: this.instanceForm.value.name,
      port: this.instanceForm.value.port,
      revision: this.instanceForm.value.revision,
      lang: this.instanceForm.value.lang,
    };
    this.apiService.instanceSave(instance).subscribe();
    this.dialogRef.close();
    // TODO: confirm reload before closing
  }
}
