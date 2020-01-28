import { Component, OnInit, PipeTransform, QueryList, ViewChildren, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Client } from './client';
import { ClientService } from './client.service';
import { SortableDirective, SortEvent } from '../directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddClientComponent } from './add-client/add-client.component';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../services/update-timestamp.service';
import {EditClientComponent} from './edit-client/edit-client.component';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.css'],
  providers: [DecimalPipe, ClientService]
})
export class ClientsViewComponent implements OnInit {
  clients: Client[];
  total: number;

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


  constructor(public service: ClientService,
              private modalService: NgbModal,
              public updateTimestampService: UpdateTimestampService,
              private toastrService: ToastrService) {
    this.service.clients$.subscribe(clients => {
      this.clients = clients;
    });
    this.service.total$.subscribe(total => {
      this.total = total;
    });
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  open() {
    const modalRef = this.modalService.open(AddClientComponent);
    modalRef.componentInstance.name = 'World';
    modalRef.result.then(
      async () => { /* console.log('When user closes'); */
                    this.service.fetchData(); },
            () => { /* console.log('Backdrop click'); */ });
  }
 deleteClient(id: string) {
    // console.log(id);
    if (confirm('Esti sigur ca vrei sa stergi acest client?')) {
      this.service.delete(id)
        .then(
          res => {
            // this.updateTimestampService.updateTimestampFormulas();
            this.toastrService.success('', 'Clientul a fost sters!!');
            this.service.fetchData();
        })
        .catch(
          fail => {
            this.toastrService.error('', 'Clientul nu a putut fi sters!');
        });
     }
  }
  blockServices(client: Client) {
    // console.log(client.clientId);
    if (confirm('Esti sigur ca vrei sa blochezi accesul acestui client la toate serviciile?')) {
      this.service.blockClient(client)
        .then(
          res => {
            // this.updateTimestampService.updateTimestampFormulas();
            this.toastrService.success('', 'Accesul clientul a fost blocat!!');
            this.service.fetchData();
        })
        .catch(
          fail => {
            this.toastrService.error('', 'Accesul clientul nu a putut fi blocat!');
        });
     }
  }
  openEditClient(client: Client ) {
    const modalRef = this.modalService.open(EditClientComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'client';
    modalRef.componentInstance.client = client;
    modalRef.result.then(
      async () => {
                    this.service.fetchData(); },
            () => {  });
  }


  ngOnInit() {
  }
}
