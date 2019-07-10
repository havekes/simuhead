import {Component, OnInit} from '@angular/core';
import {ApiService, Instance} from '../api.service';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.sass']
})
export class InstancesComponent implements OnInit {
  instances: Instance[];

  constructor(private apiService: ApiService) {
  }

  list() {
    this.apiService.instancesList().subscribe(instances => this.instances = instances);
  }

  ngOnInit() {
    this.list();
  }
}
