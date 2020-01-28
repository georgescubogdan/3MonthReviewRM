import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../clients-view/client.service';
import { DecimalPipe } from '@angular/common';
import { SrService } from '../sr.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-add-retainer',
  templateUrl: './add-retainer.component.html',
  styleUrls: ['./add-retainer.component.css']
})
@Component({
  selector: 'app-add-retainer',
  templateUrl: './add-retainer.component.html',
  styleUrls: ['./add-retainer.component.css'],
  providers: [DecimalPipe, ClientService, SrService],

})
export class AddRetainerComponent implements OnInit {
  activeButton = true;
  addRetForm = new FormGroup({
    denumire: new FormControl('', [Validators.required]),
    descriere: new FormControl('', Validators.required),
    formula: new FormControl('', Validators.required),
    prioritate: new FormControl('', [Validators.required, Validators.pattern('[1-9]+[0-9]*')]),
    removable: new FormControl(true),
  });

  public onSubmitDateFirma() {
    if (this.addRetForm.valid) {
      const data = {
        name: this.addRetForm.value.denumire,
        srModelId: this.service.maxId,
        description: this.addRetForm.value.descriere,
        formula: this.addRetForm.value.formula,
        priority: this.addRetForm.value.prioritate,
        isSpor: false,
        deletable: this.addRetForm.value.removable,
      };
      this.service.maxId++;
      this.activeButton = false;
      this.service.addRetainer(data).then(
        c => {
          this.toastrService.success('', 'Retinere adaugata cu succes!!');
          this.updateTimestampService.updateTimestampSporsAndRetainers();
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Retinere nu a putut fi adaugata!!');
        });
    } else {
      const data = {
        name: this.addRetForm.value.denumire,
        srModelId: this.service.maxId,
        description: this.addRetForm.value.descriere,
        formula: this.addRetForm.value.formula,
        priority: this.addRetForm.value.prioritate,
        isSpor: false,
        deletable: this.addRetForm.value.removable,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addRetForm.markAsTouched();
      this.addRetForm.markAsDirty();
    }
  }
  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public service: SrService
            , public toastrService: ToastrService) {
  }
  ngOnInit() {
    this.activeButton = true;
  }
}
