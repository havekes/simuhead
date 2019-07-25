import {Component, OnInit} from '@angular/core';
import {ApiService, Instance} from '../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {InstanceEditDialogComponent} from '../instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {

  instances: Instance[];
  autoReloadIntervalId: number;


  constructor(private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  /**
   * Update the list of instances
   */
  private list() {
    this._apiService.instancesList().subscribe({
      error: err => {
        this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG);
        clearInterval(this.autoReloadIntervalId);
      },
      next: instances => this.instances = instances,
    });
  }

  /**
   * Refresh with a visual cue
   */
  refresh() {
    this.instances = [];
    this.list();
  }

  /**
   * Open the instance edit dialog with no data
   */
  openCreateDialog() {
    let dialogRef = this._editDialog.open(InstanceEditDialogComponent, {
      data: {new: true, instance: <Instance>{}},
      disableClose: true,
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((instance) => {
      if (instance != undefined) {
        this.instances.push(instance);
      }
    });
  }

  /**
   * Open the instance edit dialog with the data from the selected instance
   */
  openEditDialog(i: number, instance: Instance) {
    let dialogRef = this._editDialog.open(InstanceEditDialogComponent, {
      data: {new: false, instance: instance},
      disableClose: true,
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((instance) => {
      if (instance != undefined) {
        this.instances[i] = instance;
      }
    });
  }

  /**
   * Open confirm dialog and if yes send delete request to the API
   */
  deleteConfirmDialog(i: number, promt: string) {
    let confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {
      data: promt,
      width: 'auto',
    });
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.instanceDelete(this.instances[i]).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => {
            this.list();
            confirmDialogRef.close();
          }
        });
      }
    });
  }

  ngOnInit() {
    // Initialize the list
    this.list();

    // Background update the list every 10 seconds
    this.autoReloadIntervalId = setInterval(() => {
      this.list();
    }, 10000);
  }
}
