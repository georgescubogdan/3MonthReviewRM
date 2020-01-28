import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DatesService } from './dates.service';
import { ActivatedRoute } from '@angular/router';
import { ClockingService } from '../clocking.service';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClockingDate } from '../interfaces';
import { User } from '../../users-view/user';
import { DatePipe } from '@angular/common';
import { SortableDirective, SortEvent } from '../../directives/sortable.directive';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { UsersService } from '../users-details/users.service';
import { NumberValueAccessor } from '@angular/forms/src/directives';

@Component({
  selector: 'app-dates-details',
  templateUrl: './dates-details.component.html',
  styleUrls: ['./dates-details.component.css'],
  providers: [NgbTabsetConfig, DatePipe]
})
export class DatesDetailsComponent implements OnInit {
  year: any;
  yearId: any;
  months = [];
  days = [];
  dates: ClockingDate[];
  totalDates: number;
  userId: number;
  currentMonth: number;
  currentDays: number[];
  active = false;
  model: string;
  filteredDates: ClockingDate[];
  translate = [
    'Ianuarie',
    'Februarie',
    'Martie',
    'Aprilie',
    'Mai',
    'Iunie',
    'Iulie',
    'August',
    'Septembrie',
    'Octombrie',
    'Noiembrie',
    'Decembrie'
  ];

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(
    config: NgbTabsetConfig,
    private route: ActivatedRoute,
    private clockingService: ClockingService,
    public datesService: DatesService,
    public usersService: UsersService,
    public toastrService: ToastrService,
    public updateTimestampService: UpdateTimestampService,

  ) {
    this.year = this.route.params.subscribe(async params => {
      this.yearId = +params.yearId; // (+) converts string 'id' to a number
      this.months = [];
      await this.takeMonths(this.yearId);
      this.currentMonth = this.months[0];
      this.days = await this.clockingService.getDays(this.yearId, this.months[0]);
      this.loadTable(this.yearId, this.currentMonth);


   });
    this.datesService.dates$.subscribe(dates => {
    this.dates = dates;
    this.filteredDates = dates;
  });
    this.datesService.total$.subscribe(totalDates => {
    this.totalDates = totalDates;
  });
    config.justify = 'center';
    config.type = 'pills';
   }

   loadTable(year: number, month: number) {
    this.datesService.fetchData(year, month);
  }

  ngOnInit() {
  }

   async takeMonths( year: number ) {
    const months = await this.clockingService.getMonths(year);
    this.months = this.uniqueMonths(months);
  }

  async takeDays( id: any) {
    const days = await this.clockingService.getDays(this.yearId, id.nextId );
    this.days = this.uniqueDays(days);

  }

  uniqueMonths(months: number[]) {
    const uniqueMonths = [];
    months.forEach(month => {
      if (uniqueMonths.indexOf(month) === -1) {
        uniqueMonths.push(month);
      }
    });
    return uniqueMonths.sort((a, b) => a - b);

  }
  uniqueDays(days: number[]) {
    const uniqueDays: number[] = [];
    days.forEach(day => {
      if (uniqueDays.indexOf(day) === -1) {
        uniqueDays.push(day);
      }
    });

    return uniqueDays.sort((a, b) => a - b);

  }

  onSort({column, direction, table}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.table === table && header.sortable !== column) {
        header.direction = '';
      }
    });
    this.datesService.sortColumn = column;
    this.datesService.sortDirection = direction;
  }

  filterDates(id: any) {
    this.loadTable(this.yearId, id.nextId);
  }

  filterDays(day: number) {
      this.filteredDates = this.dates;
      this.filteredDates = this.filteredDates.filter(d => new Date(d.currentDate).getDate() === day);
  }

}
