import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { SrService } from '../sr.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-edit-spor',
  templateUrl: './edit-spor.component.html',
  styleUrls: ['./edit-spor.component.css'],
  providers: [DecimalPipe,  SrService]

})
export class EditSporComponent implements OnInit {
    addSporForm = new FormGroup({
    srId: new FormControl(''),
    descriere: new FormControl('', [Validators.required]),
    isSpor: new FormControl(true),
    nume: new FormControl('', Validators.required),
    removable: new FormControl(true),
    formula: new FormControl('', Validators.required),
    prioritate: new FormControl('', [Validators.required, Validators.pattern('[1-9]+[0-9]*')]),
    });
    spor: any;
  public onEditSubmitSpor() {
    this.addSporForm.markAsDirty();
    if (this.addSporForm.valid) {
      const data = {
        srModelId: this.addSporForm.value.srId,
        description : this.addSporForm.value.descriere,
        isSpor: true,
        name: this.addSporForm.value.nume,
        deletable: this.addSporForm.value.removable,
        formula: this.addSporForm.value.formula,
        priority: this.addSporForm.value.prioritate,
      };
      this.service.changeSpor(data, data.srModelId).then(
        c => {
          this.toastrService.success('', 'Sporul schimbat cu succes!!');
          this.updateTimestampService.updateTimestampSporsAndRetainers();
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Sporul nu a putut fi schimbat!!');
        });
    } else {
      const data = {
        srModelId: this.addSporForm.value.srId,
        description : this.addSporForm.value.descriere,
        isSpor: true,
        name: this.addSporForm.value.nume,
        deletable: this.addSporForm.value.removable,
        formula: this.addSporForm.value.formula,
        prioritate: this.addSporForm.value.priority,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addSporForm.markAsTouched();
      this.addSporForm.markAsDirty();
  }
}

  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public service: SrService
            , public toastrService: ToastrService) { }

  ngOnInit() {
    const value = {
      srId: (this as any).spor.srModelId,
      descriere: this.spor.description,
      isSpor: true,
      nume: this.spor.name,
      removable: this.spor.deletable,
      formula: this.spor.formula,
      prioritate: this.spor.priority,
    };
    this.addSporForm.setValue(value);
  }

}
