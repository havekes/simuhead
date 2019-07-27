import {Component, OnInit} from '@angular/core';
import {ApiService, errorMessage, Instance, InstanceStatusCode} from '../../api.service';
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
  InstanceStatusCode: any = InstanceStatusCode;

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
        this._errorSnack.open(errorMessage(err), ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG);
      },
      next: instances => {
        // Get the pak and save infos for each instance
        for (let instance of instances) {
          this._apiService.addPakInfo(instance);
          this._apiService.addSaveInfo(instance);
        }
        this.instances = instances;
      },
      complete: () => this.sort('name')
    });
  }

  /**
   * Get all instance info including current status, paks and save
   * @param i - Instance array index
   */
  private updateInstance(i: number) {
    this._apiService.instanceGet(this.instances[i]).subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: (instance) => {
        // Add the pak and save infos
        this._apiService.addPakInfo(instance);
        this._apiService.addSaveInfo(instance);
        this.instances[i] = instance;
      }
    });
  }

  /**
   * Sort the instance list
   * @param by - Property of Instance to sort by
   */
  sort(by: string = 'name') {
    this.instances.sort((a, b) => {
      if (a[by] < b[by]) {
        return -1;
      } else if (a[by] > b[by]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Refresh list with visual cue
   */
  refresh() {
    this.instances = [];
    // TODO: add spinner
    this.list();
  }

  /**
   * Send a request to install an instance
   * @param i - Instance array id
   */
  install(i: number) {
    this._apiService.instanceInstall(this.instances[i]).subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: instance => this.instances[i] = instance
    });
  }

  /**
   * Send a request to start an instance
   * @param i - Instance array id
   */
  start(i: number) {
    this._apiService.instanceStart(this.instances[i]).subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: instance => this.instances[i] = instance
    });
  }

  /**
   * Open the instance edit dialog with empty instance data
   */
  openCreateDialog() {
    let dialogRef = this._editDialog.open(InstanceEditDialogComponent, {
      data: <Instance>{},
      disableClose: true,
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((instance: Instance) => {
      if (instance != null) {
        // Set spinner mode while the server is installing
        instance.status = InstanceStatusCode.WORKING;
        // Add the instance to the list and sort
        let i = this.instances.length;
        this.instances[i] = instance;

        // Send the new instance data to the server
        this._apiService.instancePost(instance).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.updateInstance(i)
        });
      }
    });
  }

  /**
   * Open the instance edit dialog with the data from the selected instance
   * @param i - Instance array id
   */
  openEditDialog(i: number) {
    let dialogRef = this._editDialog.open(InstanceEditDialogComponent, {
      data: this.instances[i],
      disableClose: true,
      width: 'auto',
    });
    dialogRef.afterClosed().subscribe((instance) => {
      if (instance != null) {
        // Switch to spinner mode while the server is installing
        this.instances[i].status = InstanceStatusCode.WORKING;
        this.instances[i] = instance;

        // Send the changes to the servee
        this._apiService.instancePut(instance).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.updateInstance(i)
        });
      }
    });
  }

  /**
   * Open confirm dialog and if yes send delete request to the API
   * @param i - Instance array id
   * @param promt - Delete confirm dialog text
   */
  deleteConfirmDialog(i: number, promt: string) {
    let confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {
      data: promt,
      width: 'auto',
    });
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        // Switch to spinner mode while waiting for the server
        this.instances[i].status = InstanceStatusCode.WORKING;

        // Send a delete request to the server
        this._apiService.instanceDelete(this.instances[i]).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => this.instances.splice(i, 1)
        });
      }
    });
  }

  ngOnInit() {
    // Initialize the list
    this.list();
  }
}
