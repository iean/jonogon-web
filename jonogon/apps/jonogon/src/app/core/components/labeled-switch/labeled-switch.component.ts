import { Component, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'eino-labeled-switch',
  standalone: true,
  imports: [],
  templateUrl: './labeled-switch.component.html',
  styleUrl: './labeled-switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LabeledSwitchComponent,
    },
  ],
})
export class LabeledSwitchComponent implements ControlValueAccessor {
  // Inputs ---------------------------

  /**
   * Label used for the true state (right side)
   */
  trueLabel = input.required<string>();

  /**
   * Label used for the false state (left side)
   */
  falseLabel = input.required<string>();

  /**
   * Value emitted for the true state (right side)
   */
  trueValue = input<any>(true);

  /**
   * Value emitted for the false state (left side)
   */
  falseValue = input<any>(false);

  // Properties ----------------------
  value = false;
  touched = false;
  disabled = false;

  onChange = (value: any) => {
    /* */
  };
  onTouched = () => {
    /* */
  };

  toggleValue() {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = !this.value;
      this.onChange(this.value ? this.trueValue() : this.falseValue());
    }
  }

  writeValue(value: any) {
    if (value === this.trueValue()) {
      this.value = true;
    } else if (value === this.falseValue()) {
      this.value = false;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}
