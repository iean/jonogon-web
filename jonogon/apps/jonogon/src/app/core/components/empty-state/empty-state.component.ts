import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SplashScreenComponent } from '../splash-screen/splash-screen.component';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'eino-empty-state',
  standalone: true,
  imports: [CommonModule, TranslateModule, SplashScreenComponent],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() title = 'search_drawer.no_reports_found.sub_title';
  @Input() subtitle = '';
  @Input() titleText = '';
  @Input() stepParagraph = '';
  @Input() secondaryButtonText = 'Previous';
  @Input() primaryButtonText = 'Next';
  @Input() height = '200px';
  @Input() showImage = true;
  @Output() animationCreated = new EventEmitter();
  @Output() secondaryClick = new EventEmitter();
  @Output() primaryClick = new EventEmitter();
  options: AnimationOptions = {
    path: 'assets/animations/no-data-final.json',
  };
  @Input()
  set file(value: string) {
    this.options = {
      path: `assets/animations/${value}`,
    };
  }
  constructor() {}

  onSecondaryClick(clickedSecondaryEvent: unknown): void {
    this.secondaryClick.emit(clickedSecondaryEvent);
  }

  onPrimaryClick(clickedPrimaryEvent: unknown): void {
    this.primaryClick.emit(clickedPrimaryEvent);
  }
}
