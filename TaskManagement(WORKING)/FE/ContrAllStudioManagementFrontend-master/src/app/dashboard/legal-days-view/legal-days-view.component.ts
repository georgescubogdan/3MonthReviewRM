import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { LegalDay } from './legal-day';
import { SortableDirective, SortEvent } from '../directives/sortable.directive';
import { LegalDayService } from './legal-days.service';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLegalDayComponent } from './add-legal-day/add-legal-day.component';
import { EditLegalDayComponent } from './edit-legal-day/edit-legal-day.component';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../services/update-timestamp.service';


@Component({
  selector: 'app-legal-days-view',
  templateUrl: './legal-days-view.component.html',
  styleUrls: ['./legal-days-view.component.css'],
  providers: [DecimalPipe, LegalDayService]
})
export class LegalDaysViewComponent implements OnInit {
  legalDays: LegalDay[];
  totalLegalDays: number;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


  constructor(public legalDayService: LegalDayService
            , private modalService: NgbModal
            , private updateTimestampService: UpdateTimestampService
            , public toastrService: ToastrService) {
    this.legalDayService.legalDays$.subscribe(legalDays => {
      this.legalDays = legalDays;
    });
    this.legalDayService.total$.subscribe(totalLegalDays => {
      this.totalLegalDays = totalLegalDays;
    });
  }

  onSort({column, direction, table}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.table === table && header.sortable !== column) {
        header.direction = '';
      }
    });
    this.legalDayService.sortColumn = column;
    this.legalDayService.sortDirection = direction;
  }

  ngOnInit() {
  }
  open() {
    const modalRef = this.modalService.open(AddLegalDayComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'legalDay';
    modalRef.result.then(
      async () => {
                    this.legalDayService.fetchData(); },
            () => { });
  }
  delete(i: number) {
    if (confirm('Are you sure to delete this day?')) {
      this.legalDayService.deleteLegalDay(i)
        .then(
          res => {
            this.legalDayService.fetchData();
            this.toastrService.success('', 'Acestasta Zi Libera a fost stearsa!!');
            this.updateTimestampService.updateTimestampLegalDays();
        })
        .catch(
          fail => {
            this.toastrService.error('', 'Acestasta Zi libera nu poate fi stearsa!!');
        });
    }
  }
  put(legalDay: LegalDay) {
    const modalRef = this.modalService.open(EditLegalDayComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.legalDay = legalDay;
    modalRef.componentInstance.name = 'legalDay';
    modalRef.result.then(
      async () => {
                    this.legalDayService.fetchData(); },
            () => {  });
  }
}
