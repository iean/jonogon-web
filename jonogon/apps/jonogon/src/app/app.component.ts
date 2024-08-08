import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    DialogModule,
    CardModule,
    TranslateModule,
  ],
  selector: 'jonogon-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jonogon';
}
