import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Instance, ApiService} from '../../api.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.sass']
})
export class InstanceEditDialogComponent {

  private edited = false;
  private instanceForm = new FormGroup({
    name: new FormControl(this.data.instance.name),
    port: new FormControl(this.data.instance.port),
    revision: new FormControl(this.data.instance.revision),
    lang: new FormControl(this.data.instance.lang)
  });

  constructor(public dialogRef: MatDialogRef<InstanceEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: InstanceData,
              private confirmDialog: MatDialog,
              private apiService: ApiService) {
    this.instanceForm.valueChanges.subscribe(() => {
      this.edited = true;
    });
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

  /**
   * Save values to the API
   */
  save() {
    let modifiedInstance = <Instance>this.instanceForm.value;
    let observableFromApi: Observable<any>;

    if (this.data.new) {
      observableFromApi = this.apiService.instancePost(this.instanceForm.value);
    }
    else {
      observableFromApi = this.apiService.instancePut(this.data.instance.url, this.instanceForm.value);
    }

    observableFromApi.subscribe({
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.dialogRef.close(modifiedInstance);
      }
    });
  }
}

interface InstanceData {
  new: boolean;
  instance: Instance;
}
