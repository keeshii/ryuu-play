import { Directive, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[ptcgDropHighlight]'
})
export class DropHighlightDirective {

  @HostBinding('class.ptcg-drop-highlight') class = true;
  @HostBinding('class.ptcg-drop-highlight-visible') visible = false;

  @Input() set ptcgDropHighlightVisible(value: boolean) {
    this.visible = coerceBooleanProperty(value);
  }

  constructor() { }

}
