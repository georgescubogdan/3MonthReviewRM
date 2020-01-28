import { Component, OnInit, PipeTransform, QueryList, ViewChildren, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { User } from './user';
import { UserService } from './user.service';
import { SortableDirective, SortEvent } from '../directives/sortable.directive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from './add-user/add-user.component';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../services/update-timestamp.service';
import {EditUserComponent} from './edit-user/edit-user.component';
import { EditUserRoleComponent } from './edit-userRole/edit-userRole.component';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css'],
  providers: [DecimalPipe, UserService]
})
export class UsersViewComponent implements OnInit {
  users: User[];
  total: number;

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;


  constructor(public service: UserService,
              private modalService: NgbModal,
              public updateTimestampService: UpdateTimestampService,
              private toastrService: ToastrService) {
    this.service.users$.subscribe(users => {
      this.users = users;
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
    const modalRef = this.modalService.open(AddUserComponent);
    modalRef.componentInstance.name = 'World';
    modalRef.result.then(
      async () => { /*console.log('When user closes');*/
                    this.service.fetchData(); },
            () => { /*console.log('Backdrop click');*/ });
  }
 deleteUser(id: string) {
    // console.log(id);
    if (confirm('Esti sigur ca vrei sa stergi acest user?')) {
      this.service.deleteUser(id)
        .then(
          res => {
            // this.updateTimestampService.updateTimestampFormulas();
            this.toastrService.success('', 'User-ul a fost sters!!');
            this.service.fetchData();
        })
        .catch(
          fail => {
            this.toastrService.error('', 'User-ul nu a putut fi sters!');
        });
     }
  }
  // blockServices(user: User) {
  //   console.log(user.userId);
  //   if (confirm('Esti sigur ca vrei sa blochezi accesul acestui client la toate serviciile?')) {
  //     this.service.blockClient(user)
  //       .then(
  //         res => {
  //           // this.updateTimestampService.updateTimestampFormulas();
  //           this.toastrService.success('', 'Accesul clientul a fost blocat!!');
  //           this.service.fetchData();
  //       })
  //       .catch(
  //         fail => {
  //           this.toastrService.error('', 'Accesul clientul nu a putut fi blocat!');
  //       });
  //    }
  // }
  openEditUser(user: User) {
    const modalRef = this.modalService.open(EditUserComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.userName = 'user';
    modalRef.componentInstance.user = user;

    modalRef.result.then(
      async () => {
                    this.service.fetchData(); },
            () => {  });
  }

  openEditUserRole(user: User) {
    const modalRef = this.modalService.open(EditUserRoleComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.userName = 'user';
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.userId = user.id;

    modalRef.result.then(
      async () => {
                    this.service.fetchData(); },
            () => {  });
  }


  ngOnInit() {
  }
}
