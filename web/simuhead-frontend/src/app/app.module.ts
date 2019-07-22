import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule,
  MatDialogModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatToolbarModule
} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {InstancesComponent} from './components/instances/instances.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {InstanceEditDialogComponent} from './components/instance-edit-dialog/instance-edit-dialog.component';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PaksComponent} from './components/paks/paks.component';
import {SavesComponent} from './components/saves/saves.component';
import { FileEditDialogComponent } from './components/file-edit-dialog/file-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InstancesComponent,
    NavbarComponent,
    InstanceEditDialogComponent,
    ConfirmDialogComponent,
    PaksComponent,
    SavesComponent,
    FileEditDialogComponent,
  ],
  entryComponents: [
    InstanceEditDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        autoFocus: false,
        hasBackdrop: true,
      },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
