import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Formula } from './formula';
import { SortableDirective, SortEvent } from '../directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormulaService } from './formula.service';
import { AddFormulaComponent} from './add-formula/add-formula.component';
import { EditFormulaComponent} from './edit-formula/edit-formula.component';
import { ToastrService } from 'ngx-toastr';
import { UpdateTimestampService } from '../services/update-timestamp.service';

@Component({
  selector: 'app-formula-view',
  templateUrl: './formula-view.component.html',
  styleUrls: ['./formula-view.component.css'],
  providers: [FormulaService, DecimalPipe]

})
export class FormulaViewComponent implements OnInit {

  formulas: Formula[];
  totalFormulas: number;
  totalCategories: number;

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

    constructor(
      public formulaService: FormulaService,
      public updateTimestampService: UpdateTimestampService,
      private modalService: NgbModal,
      private toastrService: ToastrService) {
    this.formulaService.formulas$.subscribe(formula => {
      this.formulas = formula;
    });
    this.formulaService.total$.subscribe(totalFormula => {
      this.totalFormulas = totalFormula;
    });
  }

  onSort({column, direction, table}: SortEvent) {
    this.headers.forEach(header => {
      if (header.table === table && header.sortable !== column) {
        header.direction = '';
      }
    });
    this.formulaService.sortColumn = column;
    this.formulaService.sortDirection = direction;
  }
  delete(formula: Formula) {
    if (!formula.deletable) {
      this.toastrService.error('', 'Acesta formula nu poate fi stersa!!');
      return;
    }
    if (confirm('Are you sure to delete this formula?')) {
      this.formulaService.deleteFormula(formula.formulaModelId)
        .then(
          res => {
            this.updateTimestampService.updateTimestampFormulas();
            this.toastrService.success('', 'Formula a fost stersa!!');
            this.formulaService.fetchData();
        })
        .catch(
          fail => {
        });
     }
  }
  put(formula: Formula ) {
    const modalRef = this.modalService.open(EditFormulaComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'formula';
    modalRef.componentInstance.formula = formula;
    modalRef.result.then(
      async () => {
                    this.formulaService.fetchData(); },
            () => {  });
  }

  ngOnInit() {
  }

  openFormulaAdd() {
    const modalRef = this.modalService.open(AddFormulaComponent, {centered: true, windowClass: 'my-modal'});
    modalRef.componentInstance.name = 'Formula';
    modalRef.result.then(
      async () => {
                    this.formulaService.fetchData(); },
            () => {  });
  }



}
