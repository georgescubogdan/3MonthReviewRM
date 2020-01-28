import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../clients-view/client.service';
import { DecimalPipe } from '@angular/common';
import { SrService } from '../sr.service';
import { Sr } from '../sr';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-edit-retainer',
  templateUrl: './edit-retainer.component.html',
  styleUrls: ['./edit-retainer.component.css'],
  providers: [DecimalPipe, ClientService, SrService]

})
export class EditRetainerComponent implements OnInit {
    addRetForm = new FormGroup({
    descriere: new FormControl('', Validators.required),
    isSpor: new FormControl(false),
    nume: new FormControl('', Validators.required),
    removable: new FormControl(true),
    formula: new FormControl('', Validators.required),
    prioritate: new FormControl('', [Validators.required, Validators.pattern('[1-9]+[0-9]*')]),
  });
  retainer: any;
  public onSubmitRetainer() {
    if (this.addRetForm.valid) {
      const data: Sr = {
        srModelId: this.retainer.srModelId,
        description : this.addRetForm.value.descriere,
        isSpor: false,
        name: this.addRetForm.value.nume,
        deletable: this.addRetForm.value.removable,
        formula: this.addRetForm.value.formula,
        priority: this.addRetForm.value.prioritate,
      };
      this.service.changeRetainer(data, data.srModelId).then(
        c => {
          this.toastrService.success('', 'Retinere schimbata cu succes!!');
          this.updateTimestampService.updateTimestampSporsAndRetainers();
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Retinerea nu a putut fi schimbata!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addRetForm.markAsTouched();
      this.addRetForm.markAsDirty();
     }
  }
  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public service: SrService
            , public toastrService: ToastrService) { }

  ngOnInit() {
    const value = {
      descriere : this.retainer.description,
      isSpor: false,
      nume: this.retainer.name,
      removable: this.retainer.deletable,
      formula: this.retainer.formula,
      prioritate: this.retainer.priority,
    };
    this.addRetForm.setValue(value);
  }

}
