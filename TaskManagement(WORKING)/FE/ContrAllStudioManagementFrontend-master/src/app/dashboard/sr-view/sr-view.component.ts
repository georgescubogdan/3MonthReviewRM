import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SrService } from './sr.service';
import { Sr } from './sr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortableDirective, SortEvent } from '../directives/sortable.directive';
import { AddSporComponent } from './add-spor/add-spor.component';
import { EditRetainerComponent} from './edit-retainer/edit-retainer.component';
import { EditSporComponent} from './edit-spor/edit-spor.component';
import { AddRetainerComponent } from './add-retainer/add-retainer.component';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../services/update-timestamp.service';

@Component({
  selector: 'app-sr-view',
  templateUrl: './sr-view.component.html',
  styleUrls: ['./sr-view.component.css'],
  providers: [DecimalPipe, SrService, ]

})
export class SrViewComponent implements OnInit {
  spors: Sr[];
  retainers: Sr[];
  totalSpors: number;
  totalRetainers: number;
  sporFocus: boolean;
  onStart: boolean;
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  constructor(public srService: SrService,
              public updateTimestampService: UpdateTimestampService,
              private modalService: NgbModal,
              private toastrService: ToastrService) {
      this.srService.spors$.subscribe(spors => {
        this.spors = spors;
      });
      this.srService.totalSpors$.subscribe(totalSpors => {
        this.totalSpors = totalSpors;
      });
      this.srService.retainers$.subscribe(retainers => {
        this.retainers = retainers;
      });
      this.srService.totalRetainers$.subscribe(totalRetainers => {
        this.totalRetainers = totalRetainers;
      });
  }
  onSort({column, direction, table}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.table === table && header.sortable !== column) {
        header.direction = '';
      }
    });
    if (table === 'spors') {
      this.onFocusSpor();
      this.srService.sortColumnSpors = column;
      this.srService.sortDirectionSpors = direction;
    } else {
      this.onFocusRetainer();
      this.srService.sortColumnRetainers = column;
      this.srService.sortDirectionRetainers = direction;
    }
  }
  ngOnInit() {
    this.onStart = true;
  }
  openSporAdd() {
    this.onFocusSpor();
    const modalRef = this.modalService.open(AddSporComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'Spor';
    modalRef.result.then(
      async () => {
        this.srService.fetchData(); },
        () => {  });
  }
  openRetrainerAdd() {
    this.onFocusRetainer();
    const modalRef = this.modalService.open(AddRetainerComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'Spor';
    modalRef.result.then(
      async () => {
        this.srService.fetchData(); },
        () => {  });
  }
  putRetainer(retainer: Sr ) {
    this.onFocusRetainer();
    const modalRef = this.modalService.open(EditRetainerComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'retainer';
    modalRef.componentInstance.retainer = retainer;
    modalRef.result.then(
      async () => {
        this.srService.fetchData(); },
        () => {  });
  }
  putSpor(spor: Sr ) {
    this.onFocusSpor();
    const modalRef = this.modalService.open(EditSporComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'spor';
    modalRef.componentInstance.spor = spor;
    modalRef.result.then(
      async () => {
        this.srService.fetchData(); },
        () => {  });
  }
  deleteSpor(spor: Sr) {
    if (!spor.deletable) {
      this.toastrService.error('', 'Acest spor nu poate fi sters!!');
      return;
    }
    if (confirm('Are you sure to delete ' + spor.name)) {
      this.onFocusSpor();
      this.srService.deleteSpor(spor)
      .then(
        () => {
          this.toastrService.success('', 'Acest spor a fost sters!!');
          this.updateTimestampService.updateTimestampSporsAndRetainers();
          this.srService.fetchData();
        })
      .catch(() => {});
    }
  }

  deleteRetainer(retainer: Sr) {
    if (!retainer.deletable) {
      this.toastrService.error('', 'Acestasta retinere nu poate fi stearsa!!');
      return;
    }
    if (confirm('Are you sure to delete ' + retainer.name)) {
      this.onFocusRetainer();
      this.srService.deleteRetainer(retainer)
      .then(
        () => {
          this.toastrService.success('', 'Acestasta retinere a fost stearsa!!');
          this.srService.fetchData();
        })
        .catch(() => { });
    }
  }

  onFocusSpor() {
    this.onStart = false;
    this.sporFocus = true;
  }
    onFocusRetainer() {
    this.onStart = false;
    this.sporFocus = false;
  }
}
