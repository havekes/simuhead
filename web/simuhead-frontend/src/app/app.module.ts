import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule, MatIconModule, MatListModule, MatToolbarModule} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {InstancesComponent} from './instances/instances.component';
import {SimuheadComponent} from './simuhead/simuhead.component';
import {NavbarComponent} from './navbar/navbar.component';
import {InstanceEditDialogComponent} from './instance-edit-dialog/instance-edit-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InstancesComponent,
    SimuheadComponent,
    NavbarComponent,
    InstanceEditDialogComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [
    InstanceEditDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
