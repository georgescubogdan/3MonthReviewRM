import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { FormulaService } from '../formula.service';
import {ToastrService} from 'ngx-toastr';
import { UpdateTimestampService } from '../../services/update-timestamp.service';


@Component({
  selector: 'app-edit-formula',
  templateUrl: './edit-formula.component.html',
  styleUrls: ['./edit-formula.component.css'],
  providers: [DecimalPipe, FormulaService]
})
export class EditFormulaComponent implements OnInit {
    addFormulaForm = new FormGroup({
    ModelId: new FormControl('', [Validators.required]),
    nume: new FormControl('', [Validators.required]) ,
    removable: new FormControl(true) ,
    formula: new FormControl('', [Validators.required]) ,
    descriere: new FormControl('', [Validators.required]) ,
    prioritate: new FormControl('', [Validators.required, Validators.pattern('[1-9]+[0-9]*')])
  });
  formula: any;
  public onEditSubmitFormula() {
    this.addFormulaForm.markAsDirty();
    if (this.addFormulaForm.valid) {
      const data = {
        formulaModelId: this.addFormulaForm.value.ModelId,
        name: this.addFormulaForm.value.nume,
        deletable: this.addFormulaForm.value.removable,
        formula: this.addFormulaForm.value.formula,
        description: this.addFormulaForm.value.descriere,
        priority: this.addFormulaForm.value.prioritate,
      };
      this.service.editFormula(data, data.formulaModelId).then(
        c => {
          this.toastrService.success('', 'Formula a fost editata cu succes!!');
          this.updateTimestampService.updateTimestampFormulas();
          this.activeModal.close('Success');
        })
        .catch(fail => {
          this.toastrService.error('', 'Formula nu a putut fi editata!!');

        });
    } else {
      const data = {
        formulaModelId: this.addFormulaForm.value.ModelId,
        name: this.addFormulaForm.value.nume,
        deletable: this.addFormulaForm.value.removable,
        formula: this.addFormulaForm.value.formula,
        description: this.addFormulaForm.value.descriere,
        prioritate: this.addFormulaForm.value.priority,
      };
      this.toastrService.error('', 'Datele nu sunt valide!!');
      this.addFormulaForm.markAsTouched();
      this.addFormulaForm.markAsDirty();
  }
}


  constructor(public activeModal: NgbActiveModal
            , public updateTimestampService: UpdateTimestampService
            , public toastrService: ToastrService
            , public service: FormulaService) {
   }

  ngOnInit() {
    const value = {
      ModelId: (this as any).formula.formulaModelId,
      nume: this.formula.name,
      removable: this.formula.deletable,
      formula: this.formula.formula,
      descriere: this.formula.description,
      prioritate: this.formula.priority,
    };
    this.addFormulaForm.setValue(value);
  }


}
