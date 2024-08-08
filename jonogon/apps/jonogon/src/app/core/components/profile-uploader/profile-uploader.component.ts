import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Avatar } from '../../models/response.model';
import { CustomerService } from '../../services/customer.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileImageCropperComponent } from '../profile-image-cropper/profile-image-cropper.component';

@Component({
  selector: 'eino-profile-uploader',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    TranslateModule,
    ProfileImageCropperComponent,
  ],
  templateUrl: './profile-uploader.component.html',
  styleUrls: ['./profile-uploader.component.scss'],
})
export class ProfileUploaderComponent implements OnInit {
  @Output() upload: EventEmitter<File> = new EventEmitter<File>();
  @Output() avatarSelected: EventEmitter<Avatar> = new EventEmitter<Avatar>();
  @Input() isLoading: boolean = false;
  @Input() image: string = '';
  @Input() fallback: string = '';
  @Input() includeAvatar: boolean = false;
  @Input() uploaderStyle: object = {};
  @Input() buttonStyle: object = {};
  @Input() loaderStyle: object = {};
  @Input() canUpload: boolean = true;
  @Input() canCrop: boolean = true;

  // Crop Inputs
  @Input() cropShape: string = 'CIRCLE';
  @Input() cropAspectRatio: number = 1;

  avatars: Avatar[] = [];

  imageChangedEvent!: Event;
  isCropImageVisible: boolean = false;

  @ViewChild('uploader')
  private uploader!: ElementRef;
  @ViewChild('avatarOverlay')
  private avatarOverlay!: OverlayPanel;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getAllAvatars();
  }

  /**
   * To get all the avatars saved in server
   */
  getAllAvatars() {
    this.customerService.getAllAvatars().subscribe((res) => {
      this.avatars = res.data || [];
    });
  }

  /**
   * To open file upload window
   */
  uploadFile() {
    if (this.isLoading || !this.canUpload) return;
    this.uploader.nativeElement.click();
  }

  /**
   * To emit avatarSelected event to the parent component
   * @param avatar Avatar
   */
  setProfileAvatar(avatar: Avatar) {
    this.avatarOverlay.toggle(false);
    this.avatarSelected.emit(avatar);
  }

  /**
   * To emit upload event to parent component
   * @param event Event
   */
  fileUploaded(event: Event) {
    if (this.isLoading) return;
    if (
      event &&
      this.uploader?.nativeElement?.files &&
      this.uploader?.nativeElement?.files.length > 0
    ) {
      if (this.canCrop) {
        this.imageChangedEvent = event;
        this.isCropImageVisible = true;
      } else {
        const file = this.uploader.nativeElement.files[0];
        this.upload.emit(file);
      }
    }
  }

  /**
   * Callback event function called when Image cropping is finished
   * @param file File
   */
  cropFinished(file: File) {
    console.log('Crop Finished: ', file);
    this.upload.emit(file);
    this.closeImageCropper();
  }

  /**
   * Function to close image cropper
   */
  closeImageCropper() {
    this.isCropImageVisible = false;
  }
}
