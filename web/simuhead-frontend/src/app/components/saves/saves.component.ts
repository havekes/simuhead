import {Component, OnInit} from '@angular/core';
import {ApiService, FileInfo, sortFileInfo} from '../../api.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FileEditDialogComponent} from '../file-edit-dialog/file-edit-dialog.component';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

const ERROR_SNACK_ACTION = 'OK';
const ERROR_SNACK_CONFIG = {
  duration: 5000
};

@Component({
  selector: 'app-saves',
  templateUrl: './saves.component.html',
  styleUrls: ['./saves.component.sass']
})
export class SavesComponent implements OnInit {

  saves: FileInfo[];

  constructor(private _apiService: ApiService,
              private _fileDialog: MatDialog,
              private _confirmDialog: MatDialog,
              private _errorSnack: MatSnackBar) {
  }

  private list() {
    this._apiService.savesList().subscribe({
      error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
      next: saves => this.saves = saves,
      complete: () => this.saves.sort(sortFileInfo)
    });
  }

  openCreateDialog(title: string) {
    let createDialogRef = this._fileDialog.open(FileEditDialogComponent, {
      data: {title: title, file: <FileInfo>{}},
      disableClose: true,
      width: 'auto',
    });
    createDialogRef.afterClosed().subscribe(data => {
      if (data != undefined) {
        this._apiService.savePost(data).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => {
            this.list();
            createDialogRef.close();
          }
        });
      }
    });
  }

  deleteConfirmDialog(i, prompt) {
    let confirmDialog = this._confirmDialog.open(ConfirmDialogComponent, {
      data: prompt,
    });
    confirmDialog.afterClosed().subscribe((answer) => {
      if (answer) {
        this._apiService.saveDelete(this.saves[i]).subscribe({
          error: err => this._errorSnack.open(err.message, ERROR_SNACK_ACTION, ERROR_SNACK_CONFIG),
          complete: () => {
            this.list();
            confirmDialog.close();
          }
        });
      }
    });
  }

  ngOnInit() {
    this.list();
  }
}
