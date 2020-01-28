import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidationErrors, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { UserService } from '../user.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';
import { RoleOptions } from '../role-options';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-edit-userRole',
  templateUrl: './edit-userRole.component.html',
  styleUrls: ['./edit-userRole.component.css'],
  providers: [DecimalPipe, UserService],

})

export class EditUserRoleComponent implements OnInit {
  userId: number;
  curentUserRoles = [];
  roleOptions = RoleOptions;
  allRoles = [];
  editUserRoleForm: FormGroup = null;
  user: any;
  public onEditSubmitUserRoles() {
    this.editUserRoleForm.markAsDirty();
    this.allRoles.map(roleStr => this.editUserRoleForm.value[roleStr]);
    // tslint:disable-next-line: max-line-length
    const roles = this.allRoles.map(roleStr => this.editUserRoleForm.value[roleStr]).map((role, index) => role ? index + 1 : -1).filter(role => role !== -1);

    if (this.editUserRoleForm.valid) {
      const data = {
        userId: this.user.id,
        userRoles: roles,
      };
      this.service.editRoles(data.userId, data.userRoles).then(
        c => {
          this.toastrService.success('', 'Rolul a fost schimbat cu succes!!');
          this.updateTimestampService.updateTimestampSubDomains();
          this.activeModal.close('Success');

        })
        .catch(fail => {
          this.toastrService.error('', 'Rolul nu a putut fi schimbat!!');
        });
      } else {
        const data = {
          userRole: this.editUserRoleForm.value.userRole,
        };
        this.toastrService.error('', 'Datele nu sunt valide!!');
        this.editUserRoleForm.markAsDirty();
      }
  }
  constructor(public activeModal: NgbActiveModal,
              public toastrService: ToastrService,
              public updateTimestampService: UpdateTimestampService,
              public service: UserService,
              public fb: FormBuilder) {
  }
  async ngOnInit() {
    const group = {};

    await this.service.getUserRole(this.userId).then(
      userRoles => {
        userRoles.forEach(element => {
          this.curentUserRoles.push(element.name);
        });
      }
    );

    await this.service.getRoles().then(
      userRoles => {
        userRoles.forEach(element => {
          this.allRoles.push(element.name);
          group[element.name] = new FormControl(this.checkRole(element.name));
        });
        this.editUserRoleForm = new FormGroup(group);
      }
    );

  }

  public checkRole(role: string): boolean {
    if (this.curentUserRoles.includes(role)) {
      return true;
    }
    return false;
  }
}
