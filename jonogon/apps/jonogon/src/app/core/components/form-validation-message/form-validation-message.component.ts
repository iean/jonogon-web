import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'eino-form-validation-message',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './form-validation-message.component.html',
  styleUrls: ['./form-validation-message.component.scss'],
})
export class FormValidationMessageComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) messages: {
    validation: string;
    message: string;
  }[] = [];
}
