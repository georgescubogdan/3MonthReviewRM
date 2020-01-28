import { Component, OnInit } from '@angular/core';

import { User} from './interfaces';
import { NgbModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClockingService } from './clocking.service';


@Component({
  selector: 'app-clocking-view',
  templateUrl: './clocking-view.component.html',
  styleUrls: ['./clocking-view.component.css']
})
export class ClockingViewComponent implements OnInit {
  profActiv: boolean;
  users: User[];
  tabSelected = 1;
  totalUsers: number;
  totalDates: number;
  years: number[];
  months: string[];


  uniqueUsers(users: User[]): User[] {
    const uniqueIds = [];
    const uniqueUsers = [];

    users.forEach(user => {
      if (uniqueIds.indexOf(user.id) === -1) {
        uniqueIds.push(user.id);
        uniqueUsers.push(user);
      }
    });
    return uniqueUsers;
  }

  constructor(public clockingService: ClockingService, private modalService: NgbModal, public toastrService: ToastrService) {
    this.clockingService.users$.subscribe(users => {
      this.users = users;
      this.users = this.uniqueUsers(users);
    });
    this.clockingService.years$.subscribe(years => { this.years = years; });
    this.clockingService.total$.subscribe(totalUsers => {
      this.totalUsers = totalUsers;
    });
    this.profActiv = false;

  }

  deactivateDetails() {
    this.profActiv = false;
    this.tabSelected = 0;
  }

  tabSelect(nr: number) {
    this.tabSelected = nr;
  }

  ngOnInit() {
  }

  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId.includes('month')) {
      $event.preventDefault();
    }
  }
}
