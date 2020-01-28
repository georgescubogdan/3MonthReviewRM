import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { SD } from './s-d';
import { SortableDirective, SortEvent } from '../directives/sortable.directive';
import { SubDomainService } from './sub-domain.service';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import { Profile } from './profile';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { AddSubDomainComponent } from './add-sub-domain/add-sub-domain.component';

@Component({
  selector: 'app-sub-domains-view',
  templateUrl: './sub-domains-view.component.html',
  styleUrls: ['./sub-domains-view.component.css'],
  providers: [DecimalPipe, SubDomainService]
})
export class SubDomainsViewComponent implements OnInit {
  subDomains: SD[];
  totalSubDomains: number;
  profActiv: boolean;
  tabSelected = 1;
  sdSelected = 1;
  activeIds: string[] = [];
  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


  constructor(public subDomainService: SubDomainService, private modalService: NgbModal, public toastrService: ToastrService) {
    this.subDomainService.subDomains$.subscribe(subDomains => {
      this.subDomains = subDomains;
    });
    this.subDomainService.total$.subscribe(totalSubDomains => {
      this.totalSubDomains = totalSubDomains;
    });
    this.profActiv = false;

  }
  deactivateDetails() {
    this.profActiv = false;
    this.tabSelected = 0;
  }
  onSort({column, direction, table}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.table === table && header.sortable !== column) {
        header.direction = '';
      }
    });
    this.subDomainService.sortColumn = column;
    this.subDomainService.sortDirection = direction;
  }
  tabSelect(nr: number) {
    this.tabSelected = nr;
  }
  sdSelect(nr: number) {
    this.sdSelected = nr;
  }
  ngOnInit() {
  }
  deleteProfile(i: number) {
    if (confirm('Esti sigur ca vrei sa stergi acest Profil?')) {
      this.subDomainService.deleteProfile(i)
        .then(
          res => {
            this.subDomainService.fetchData();
            this.toastrService.success('', 'Acest profil a fost sters!!');
            this.profActiv = false;
        })
        .catch(
          fail => {
            this.toastrService.error('', 'Acest profil nu a putut fi sters!!');
        });
    }
  }
  deleteSubDomain(i: number) {
    if (confirm('Esti sigur ca vrei sa stergi acest Subdomeniu?')) {
      this.subDomainService.deleteSubDomain(i)
        .then(
          res => {
            this.subDomainService.fetchData();
            this.toastrService.success('', 'Acest Subdomeniu a fost sters!!');
            this.profActiv = false;
        })
        .catch(
          fail => {
            this.toastrService.error('', 'Acest Subdomeniu nu a putut fi sters!!');
        });
    }
  }
  addProfile(sd: SD) {
    const modalRef = this.modalService.open(AddProfileComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.subDomainId = sd.subDomainId;
    modalRef.result.then(
      async () => {
                    this.subDomainService.fetchData();
                    this.profActiv = false; },
            () => {  });
  }
  addSubDomain() {
    const modalRef = this.modalService.open(AddSubDomainComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.result.then(
      async () => {
                    this.subDomainService.fetchData();
                    this.profActiv = false; },
                    () => {  });
  }

  setActiveProfile(profile: Profile) {
    this.profActiv = true;
    this.subDomainService.activeProfileID = profile.profileModelId;
  }


}
