import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

enum BlockView {
  PREVIEW,
  CODE,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'block-viewer',
  template: `
    <div class="block-section">
      <div class="block-content">
        @if (blockView === BlockView.PREVIEW) {
          <div [class]="containerClass" [ngStyle]="previewStyle">
            <ng-content></ng-content>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./blockviewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    ChipModule,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    TooltipModule,
  ],
})
export class BlockViewerComponent {
  @Input() header!: string;

  @Input() code!: string;

  @Input() containerClass!: string;

  @Input() previewStyle!: object;

  @Input() free: boolean = true;

  @Input() new: boolean = false;

  BlockView = BlockView;

  blockView: BlockView = BlockView.PREVIEW;

  activateView(event: Event, blockView: BlockView) {
    this.blockView = blockView;
    event.preventDefault();
  }

  async copyCode(event: Event) {
    await navigator.clipboard.writeText(this.code);
    event.preventDefault();
  }
}
