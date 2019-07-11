import {Component, OnInit} from '@angular/core';
import {ApiService, Instance} from '../api.service';
import {MatDialog} from '@angular/material';
import {InstanceEditDialogComponent} from '../instance-edit-dialog/instance-edit-dialog.component';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {
  instances: Instance[];

  constructor(private apiService: ApiService,
              private editDialog: MatDialog) {
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

  /*
    Open the instance edit dialog
   */
  openEditDialog(instance) {
    this.editDialog.open(InstanceEditDialogComponent, {
      width: '400px',
      data: instance,
      disableClose: true,
    });
  }

  ngOnInit() {
    // Initialize the list
    this.list();

    // Background update the list every 10 seconds
    setInterval(() => {
      this.list()
    }, 10000);
  }
}
