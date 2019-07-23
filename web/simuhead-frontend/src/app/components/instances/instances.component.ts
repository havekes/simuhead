import {Component, OnInit} from '@angular/core';
import {ApiService, Instance} from '../../api.service';
import {MatDialog} from '@angular/material';
import {InstanceEditDialogComponent} from '../instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {

  instances: Instance[];

  constructor(private apiService: ApiService,
              private editDialog: MatDialog,
              private confirmDialog: MatDialog) {
  }

  /*
    Update the list of instances
   */
  private list() {
    this.apiService.instancesList().subscribe(instances => this.instances = instances);
  }

  /*
    Refresh with a visual cue
   */
  refresh() {
    this.instances = [];
    this.list();
  }

  openCreateDialog() {
    let dialogRef = this.editDialog.open(InstanceEditDialogComponent, {
      width: '400px',
      data: {new: true, instance: <Instance>{}},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((instance) => {
      if (instance != undefined) {
        this.instances.push(instance);
      }
    });
  }

  /*
    Open the instance edit dialog with the data from the selected instance
   */
  openEditDialog(i, instance) {
    let dialogRef = this.editDialog.open(InstanceEditDialogComponent, {
      width: '400px',
      data: {new: false, instance: instance},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((instance) => {
      if (instance != undefined) {
        this.instances[i] = instance;
      }
    });
  }

  deleteConfirmDialog(i, promt) {
    let confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: promt
    });
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this.apiService.instanceDelete(this.instances[i]).subscribe({
          error: err => {
            console.log(err);
          },
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
    setInterval(() => {
      this.list();
    }, 10000);
  }
}
