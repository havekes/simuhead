import {Component, OnInit} from '@angular/core';
import {ApiService, FileInfo} from '../../api.service';
import {MatDialog} from '@angular/material';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';

@Component({
  selector: 'app-paks',
  templateUrl: './paks.component.html',
  styleUrls: ['./paks.component.sass']
})
export class PaksComponent implements OnInit {

  paks: FileInfo[];

  constructor(private apiService: ApiService,
              private editDialog: MatDialog,
              private confirmDialog: MatDialog) {
  }

  private list() {
    this.apiService.paksList().subscribe(paks => this.paks = paks);
  }

  openCreateDialog() {
    let createDialogRef = this.editDialog.open(FileEditDialogComponent, {
      width: '400px',
      disableClose: true,
    });
  }

  ngOnInit() {
    this.list();
  }
}
