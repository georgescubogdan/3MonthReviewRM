import { Component, OnInit, ViewChildren, QueryList, Input } from '@angular/core';
import { SubDomainService } from '../sub-domain.service';
import { Profile } from '../profile';
import { Iban } from '../iban';
import { SortableDirective, SortEvent } from '../../directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {IbanService} from './ibans.service';
import { ActivatedRoute } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import {EditIbanComponent} from './edit-iban/edit-iban.component';
import {AddIbanComponent} from './add-iban/add-iban.component';
import { SD } from '../s-d';

@Component({
  selector: 'app-sub-domain-details',
  templateUrl: './sub-domain-details.component.html',
  styleUrls: ['./sub-domain-details.component.css']
})
export class SubDomainDetailsComponent implements OnInit {
    profile;
    ibans: Iban[];
    totalIbans: number;
    profileID: number;
    activeProfile: Profile;
    activeSubDomain: SD;
    active = false;
    @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;
  constructor(public subDomainService: SubDomainService,
              private modalService: NgbModal,
              public ibansService: IbanService,
              public toastrService: ToastrService,
              public updateTimestampService: UpdateTimestampService,
              private route: ActivatedRoute, ) {
                this.ibansService.ibans$.subscribe(ibans => {
                  this.ibans = ibans;
                });
                this.ibansService.total$.subscribe(totalIbans => {
                  this.totalIbans = totalIbans;
                });
                this.route.paramMap.subscribe(async params => {
                  this.loadTable(+params.get('profileModelId'));
                  this.profileID = +params.get('profileModelId') ;
                  this.activeProfile = await this.subDomainService.getProfileById(this.profileID);
                  this.activeSubDomain = await this.subDomainService.getSubDomainById(this.activeProfile.subDomainId);
                  this.active = true;
                });
   }
  loadTable(id: number) {
    this.ibansService.fetchData(id);
  }
  ngOnInit() {
  }
  onSort({column, direction, table}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.table === table && header.sortable !== column) {
        header.direction = '';
      }
    });
    this.ibansService.sortColumn = column;
    this.ibansService.sortDirection = direction;
  }
  delete(iban: Iban) {
    if (confirm('Esti sigur ca vrei sa stergi acest iban?')) {
    const id = this.profileID;
    this.ibansService.deleteIban(iban, id).then(
      res => {
        this.ibansService.fetchData(id);
        this.toastrService.success('', 'Acest iban a fost sters!!');
        this.updateTimestampService.updateTimestampSubDomains();
    })
    .catch(
      fail => {
        this.toastrService.error('', 'Acest iban nu poate fi sters!!');
    });
  }
}
  edit(iban: Iban) {
    const modalRef = this.modalService.open(EditIbanComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.iban = iban;
    modalRef.componentInstance.name = 'iban';
    modalRef.result.then(
      async () => {
                    this.ibansService.fetchData(this.profileID); },
            () => {});
  }
  openIbanAdd() {
    const modalRef = this.modalService.open(AddIbanComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.profileID = this.profileID;
    modalRef.componentInstance.name = 'iban';
    modalRef.result.then(
      async () => {
                    this.ibansService.fetchData(this.profileID); },
            () => {  });
  }
  save() {
    this.subDomainService.changeSubDomain(this.activeSubDomain, this.activeSubDomain.subDomainId).then(
      c => {
      })
      .catch(fail => {
        this.toastrService.error('', 'Modificarile  Subdomeniului nu au putut fi salvate!!');
      });
    this.subDomainService.changeProfile(this.activeProfile, this.activeProfile.profileModelId).then(
        c => {
          this.updateTimestampService.updateTimestampSubDomains();
          this.toastrService.success('', 'Modificarile au fost salvate cu succes!!');
          this.subDomainService.fetchData();
        })
        .catch(fail => {
          this.toastrService.error('', 'Modificarile la profil nu au putut fi salvate!!');
        });
  }
}
