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

  /*
    Updates the list of instances
   */
  list() {
    this.apiService.instancesList().subscribe(instances => this.instances = instances);
  }

  /*
    Call when manually refreshing to show a visual cue
   */
  refresh() {
    this.instances = [];
    this.list();
  }

  ngOnInit() {
    this.list();

    // Update the list every 10 seconds
    setInterval(() => {
      this.list()
    }, 10000);
  }
}
