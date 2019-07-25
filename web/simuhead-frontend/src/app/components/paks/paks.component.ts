import {Component, OnInit} from '@angular/core';
import {ApiService, FileInfo} from '../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-paks',
  templateUrl: './paks.component.html',
  styleUrls: ['./paks.component.sass']
})
export class PaksComponent implements OnInit {

  paks: FileInfo[];

  constructor(private _apiService: ApiService,
              private _editDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.paksList().subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: paks => this.paks = paks
    });
  }

  openCreateDialog() {
    let createDialogRef = this._editDialog.open(FileEditDialogComponent, {
      data: {new: true, file: <FileInfo>{}},
      disableClose: true,
      width: '400px',
    });
  }

  deleteConfirmDialog(i, prompt) {
    let confirmDialogRef = this._confirmDialog.open(ConfirmDialogComponent, {
      data: prompt
    });
    confirmDialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.pakDelete(this.paks[i]).subscribe({
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
    this.list();
  }
}
