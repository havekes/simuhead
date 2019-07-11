import {Component, OnInit, ViewChild} from '@angular/core';
import {InstancesComponent} from '../instances/instances.component';

@Component({
  selector: 'app-simuhead',
  templateUrl: './simuhead.component.html',
  styleUrls: ['./simuhead.component.sass']
})
export class SimuheadComponent implements OnInit {

  @ViewChild(InstancesComponent, {static: false})
  private instancesComponent: InstancesComponent;

  refresh() {
    this.instancesComponent.refresh();
  }

  ngOnInit() {
  }

}
