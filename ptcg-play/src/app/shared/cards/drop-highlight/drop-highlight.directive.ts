import { Directive, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[ptcgDropHighlight]'
})
export class DropHighlightDirective {

  @HostBinding('class.ptcg-drop-highlight') class = true;
  @HostBinding('class.ptcg-drop-highlight-visible') visible = false;
  @HostBinding('class.ptcg-drop-highlight-outside') outside = false;

  @Input() set ptcgDropHighlightVisible(value: boolean) {
    this.visible = coerceBooleanProperty(value);
  }

  @Input() set ptcgDropHighlight(value: string) {
    this.outside = value === 'outside';
  }

  constructor() { }

}
