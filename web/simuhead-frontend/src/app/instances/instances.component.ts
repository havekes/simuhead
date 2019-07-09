import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {

  constructor(private apiService: ApiService) {
  }

  async ping() {
    this.apiService.ping()
  }

  ngOnInit() {
  }

}
