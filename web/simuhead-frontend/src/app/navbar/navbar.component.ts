import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  @Output() doRefresh = new EventEmitter();

  refresh() {
    this.doRefresh.emit();
  }

  ngOnInit() {
  }

}
