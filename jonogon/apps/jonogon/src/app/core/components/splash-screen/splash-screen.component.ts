import { Component, Input } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'eino-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css'],
  standalone: true,
  imports: [LottieComponent],
})
export class SplashScreenComponent {
  @Input() options: AnimationOptions = {
    path: '/assets/animations/no-data-final.json',
  };
  @Input() height = '100%';
}
