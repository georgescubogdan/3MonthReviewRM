import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UsersService } from './users.service';
import { ClockingDate, User } from '../interfaces';
import { SortableDirective, SortEvent } from '../../directives/sortable.directive';
import { NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ClockingService } from '../clocking.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AddDateComponent } from '../add-date/add-date.component';
import { EditDateComponent } from '../edit-date/edit-date.component';


@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.css'],
  providers: [DatePipe]
})
export class UsersDetailsComponent implements OnInit {

  dates: ClockingDate[];
  totalDates: number;
  userId: number;
  activeUser: User;
  active = false;
  model: Date;
  datesFiltered: ClockingDate[];

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(public usersService: UsersService,
                private modalService: NgbModal,
                public clockingService: ClockingService,
                public toastrService: ToastrService,
                public updateTimestampService: UpdateTimestampService,
                private route: ActivatedRoute,
                private datePipe: DatePipe) {
              this.usersService.dates$.subscribe(dates => {
                this.dates = dates;
                this.datesFiltered = this.dates;
              });
              this.usersService.total$.subscribe(totalDates => {
                this.totalDates = totalDates;
              });
              this.route.paramMap.subscribe(async params => {
                this.loadTable(+params.get('userId'));
                this.userId = +params.get('userId') ;
                this.activeUser = await this.clockingService.getUserById(this.userId);
                this.active = true;
              });

 }
searchDate(term: NgbDate) {
  if (term == null) {
    this.datesFiltered = this.dates;

  } else {
    this.datesFiltered = this.dates.filter(d => new Date(d.currentDate).getDate() === term.day
                                      && new Date(d.currentDate).getMonth() === (term.month - 1)
                                      && new Date(d.currentDate).getFullYear() === term.year);
                                      }
}

loadTable(id: number) {
  this.usersService.fetchData(id);
}
ngOnInit() {
}
get today() {
  return new Date();
}
onSort({column, direction, table}: SortEvent) {

  // resetting other headers
  this.headers.forEach(header => {
    if (header.table === table && header.sortable !== column) {
      header.direction = '';
    }
  });
  this.usersService.sortColumn = column;
  this.usersService.sortDirection = direction;
}
delete(date: ClockingDate) {
  if (confirm('Esti sigur ca vrei sa stergi aceasta data ?')) {
  const id = date.dateId;
  this.usersService.deleteDate(id).then(
    res => {
      this.usersService.fetchData(id);
      this.toastrService.success('', 'Aceasta data a fost stearsa!');
      this.updateTimestampService.updateTimestampDates();
  })
  .catch(
    fail => {
      this.toastrService.error('', 'Aceasta data nu poate fi stearsa!');
  });
}
}
edit(date: ClockingDate) {
  const modalRef = this.modalService.open(EditDateComponent, {centered: true, windowClass: 'my-modal'});
  modalRef.componentInstance.date = date;
  modalRef.componentInstance.userId = this.userId;
  modalRef.componentInstance.name = 'date';
  modalRef.result.then(
    async () => {
                  this.usersService.fetchData(this.userId); },
          () => {});
}
openDateAdd() {
  const modalRef = this.modalService.open(AddDateComponent, {centered: true, windowClass: 'my-modal'});
  modalRef.componentInstance.userId = this.userId;
  modalRef.componentInstance.name = 'date';
  modalRef.result.then(
    async () => {
                  this.usersService.fetchData(this.userId); },
          () => {  });
}
}

