import {Directive, EventEmitter, Input, Output, HostBinding, HostListener} from '@angular/core';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: string;
  direction: SortDirection;
  table: string;
}

@Directive({
// tslint:disable-next-line: directive-selector
  selector: 'th[sortable]',
// tslint:disable-next-line: use-host-property-decorator
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
 }
})
export class SortableDirective {
  // @HostBinding('class.desc') direction = 'desc';
  @Input() sortable: string;
  @Input() table = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();
  /*@HostBinding('class.asc') this.direction === 'asc';
  @HostBinding('class.desc')
  @HostListener('click')*/

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction, table: this.table});
  }


}
