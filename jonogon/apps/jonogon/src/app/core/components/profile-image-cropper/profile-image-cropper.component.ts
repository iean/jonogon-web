import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'eino-profile-image-cropper',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ImageCropperModule,
    TranslateModule,
    DividerModule,
    ButtonModule,
  ],
  templateUrl: './profile-image-cropper.component.html',
  styleUrls: ['./profile-image-cropper.component.scss'],
})
export class ProfileImageCropperComponent {
  breakpoints = {
    '2400px': '50vw',
    '1440px': '60vw',
    '1024px': '70vw',
    '800px': '90vw',
  };

  @Input() isVisible: boolean = false;
  @Input() event!: Event;
  @Input() shape!: string;
  @Input() aspectRatio: number = 1;

  croppedImage!: File;

  @Output() cropFinished: EventEmitter<File> = new EventEmitter<File>();

  @Output() closeCropper: EventEmitter<void> = new EventEmitter();

  imageCropped(event: ImageCroppedEvent) {
    if (event && event.blob) {
      this.croppedImage = new File([event.blob], 'Image', {
        lastModified: new Date().getUTCMilliseconds(),
        type: event.blob.type,
      });
    }
  }

  cropCompleted() {
    this.cropFinished.emit(this.croppedImage);
  }

  closeImageCropper() {
    this.closeCropper.emit();
  }
}
