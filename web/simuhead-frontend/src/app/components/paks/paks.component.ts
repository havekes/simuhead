import {Component, OnInit} from '@angular/core';
import {ApiService, Pak} from '../../api.service';

@Component({
  selector: 'app-paks',
  templateUrl: './paks.component.html',
  styleUrls: ['./paks.component.sass']
})
export class PaksComponent implements OnInit {

  paks: Pak[];

  constructor(private apiService: ApiService) {
  }

  private list() {
    this.apiService.paksList().subscribe(paks => this.paks = paks);
  }

  ngOnInit() {
    this.list();
  }
}
