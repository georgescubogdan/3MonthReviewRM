import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { FormulaService } from '../formula.service';
import { Formula } from '../formula';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';

@Component({
  selector: 'app-add-formula',
  templateUrl: './add-formula.component.html',
  styleUrls: ['./add-formula.component.css'],
  providers: [DecimalPipe, FormulaService]
})
export class AddFormulaComponent implements OnInit {
    activeButton = true;
    addProdForm = new FormGroup({
    ModelId: new FormControl(''),
    nume: new FormControl('', [Validators.required]),
    removable: new FormControl(true),
    formula: new FormControl('', Validators.required),
    descriere: new FormControl('', Validators.required),
    prioritate: new FormControl('', [Validators.required, Validators.pattern('[1-9]+[0-9]*')])
  });
 public onSubmitFormula() {
    if (this.addProdForm.valid) {
      const data: Formula = {
        formulaModelId: 0,
        name: this.addProdForm.value.nume,
        deletable: this.addProdForm.value.removable,
        formula: this.addProdForm.value.formula,
         description: this.addProdForm.value.descriere,
        priority: this.addProdForm.value.prioritate,
      };
      this.activeButton = false;
      this.service.addFromula(data).then(
        c => {
          this.toastrService.success('', 'Formula a fost adaugata cu succes!!');
          this.updateTimestampService.updateTimestampFormulas();
          this.activeButton = true;
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Formula nu a putut fi adaugata!!');
        });
    } else {
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addProdForm.markAsTouched();
      this.addProdForm.markAsDirty();
    }
  }
  setUserCategoryValidators() {}

  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public service: FormulaService
            , public toastrService: ToastrService ) {
    this.setUserCategoryValidators();
   }

  ngOnInit() {
    this.activeButton = true;
  }

}
