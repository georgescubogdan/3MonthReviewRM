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
  selector: 'app-add-spor',
  templateUrl: './add-spor.component.html',
  styleUrls: ['./add-spor.component.css'],
  providers: [DecimalPipe, ClientService, SrService]

})
export class AddSporComponent implements OnInit {
    activeButton = true;
    addSporForm = new FormGroup({
    srId: new FormControl(''),
    descriere: new FormControl('', [Validators.required]),
    isSpor: new FormControl(true),
    nume: new FormControl('', Validators.required),
    removable: new FormControl(true),
    formula: new FormControl('', Validators.required),
    prioritate: new FormControl('', [Validators.required, Validators.pattern('[1-9]+[0-9]*')]),
  });

  public onSubmitSpor() {
    if (this.addSporForm.valid) {
      const data: Sr = {
        srModelId: this.service.maxId,
        description : this.addSporForm.value.descriere,
        isSpor: true,
        name: this.addSporForm.value.nume,
        deletable: this.addSporForm.value.removable,
        formula: this.addSporForm.value.formula,
        priority: this.addSporForm.value.prioritate,
      };
      this.service.maxId++;
      this.activeButton = false;
      this.service.addSpor(data).then(
        c => {
          this.toastrService.success('', 'Sporul a fost adaugat cu succes!!');
          this.updateTimestampService.updateTimestampSporsAndRetainers();
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Sporul nu a putut fi adaugat!!');
        });
    } else {
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
    this.activeButton = true;
  }

}
