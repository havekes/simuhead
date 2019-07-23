import {Component, OnInit} from '@angular/core';
import {ApiService, FileInfo} from '../../api.service';
import {MatDialog} from '@angular/material';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

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
      data: {new: true, file: <FileInfo>{}},
      width: '400px',
      disableClose: true,
    });
  }

  deleteConfirmDialog(i, prompt) {
    let confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: prompt
    });
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this.apiService.pakDelete(this.paks[i]).subscribe({
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
    this.list();
  }
}
