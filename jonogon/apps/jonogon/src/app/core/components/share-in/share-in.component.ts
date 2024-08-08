import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { ShareInFileStatus, ShareInItem } from '../../models/app-user.model';
import { ShareInService } from '../../services/share-in.service';
import { ResourceDrawerService } from '@eino/resource';
import { PermissionService } from '../../services/permission.service';
import { AppUserStore } from '../../states/app-user/app-user.store';
import { UIStore } from '../../states/ui/ui.store';
import { NotificationService } from '../../services/notification.service';
import { LanguageWrapperService } from '../../services/language-wrapper.service';
import { SendIntent } from 'send-intent';
import { resetStores } from '@datorama/akita';

@Component({
  selector: 'eino-share-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-in.component.html',
  styleUrls: ['./share-in.component.scss'],
})
export class ShareInComponent implements AfterViewInit {
  canCreateResource = this.permissionService.hasPermission('CREATE_RESOURCES');
  shareInData: any;

  constructor(
    private shareInService: ShareInService,
    private resourceDrawerService: ResourceDrawerService,
    private permissionService: PermissionService,
    private appUserStore: AppUserStore,
    private uiStore: UIStore,
    private notificationService: NotificationService,
    private languageService: LanguageWrapperService
  ) {}

  ngAfterViewInit() {
    // todo
    // this.uiQuery.currentSharedInItems$.subscribe((data) => {
    //   console.log('FILES ' + JSON.stringify(data));
    // });
    setTimeout(() => {
      // toDO
      // this.getQueueFiles();
    }, 2000);
    setTimeout(() => {
      this.handleData();
      // combineLatest([
      //   this.uiQuery.shareInFileProcessed$,
      //   this.uiQuery.shareInOpenedForCompanyStatus$,
      //   this.uiQuery.currentSharedInItems$,
      //   this.appUserQuery.companies$,
      // ]).subscribe(
      //   ([
      //     shareInFileProcessed,
      //     shareInOpenedForCompanyStatus,
      //     currentSharedInItems,
      //     companies,
      //   ]) => {
      //     console.log('status ' + shareInFileProcessed);

      //     if (companies && companies.length > 1) {
      //       if (
      //         !shareInFileProcessed &&
      //         shareInOpenedForCompanyStatus === 'selected' &&
      //         currentSharedInItems &&
      //         currentSharedInItems.length > 0
      //       ) {
      //         {
      //           this.handleShareInDataAfterCompanySelection(
      //             currentSharedInItems
      //           );
      //         }
      //       }
      //     } else {
      //       console.log('Single COMPANIES');
      //     }
      //   }
      // );
    }, 3000);
  }
  public async readSingleFile(shareInFile: ShareInItem): Promise<void> {
    if (Capacitor.getPlatform() === 'android') {
      return this.shareInService.readFile(shareInFile);
    }
    if (Capacitor.getPlatform() === 'ios') {
      return this.shareInService.readFile(shareInFile);
    }
  }
  async handleShareInDataAfterCompanySelection(
    uploadList: ShareInItem[]
  ): Promise<void> {
    if (uploadList && uploadList.length > 0) {
      this.resourceDrawerService.openResourceDrawerInCreateMode();
      this.canCreateResource =
        this.permissionService.hasPermission('CREATE_RESOURCES');
      // if it has valid items to be shared in the app
      if (uploadList && uploadList.length > 0) {
        if (this.canCreateResource) {
          uploadList.forEach(async (fileResult) => {
            // this is a link to be added

            console.log(
              'uploading file with handleShareInDataAfterCompanySelection' +
                fileResult.title
            );
            try {
              if (fileResult.type === 'text/plain') {
                // todo
                // this.shareInService.handleLinkShare(fileResult);
              } else {
                try {
                  this.appUserStore.setIsReadingFiles(true);
                  const result = await this.readSingleFile(fileResult);
                  fileResult.status = ShareInFileStatus.SUCCESSFUL;
                  this.appUserStore.setIsReadingFiles(false);
                } catch (error) {
                  console.error('Error reading file:', error);
                  this.resetShareInForIOS();
                }
              }
            } catch (error) {
              console.error('Error reading file:', error);
              this.resetShareInForIOS();
              this.appUserStore.setShareInFileProcessed(true);
            }
          });
          this.appUserStore.setShareInFileProcessed(true);
        } else {
          this.notificationService.showNotification(
            'info',
            this.languageService.getInstantTranslation(
              'share_in.viewer_notification'
            )
          );
          this.appUserStore.setShareInFileProcessed(true);
        }
      }
    }
    this.resetShareInForIOS();
  }

  resetShareInForIOS() {
    localStorage.setItem('is_share_in_ios', '');
    localStorage.setItem('fileList', '');
    this.appUserStore.setShareInFileProcessed(true);
  }

  async handleData() {
    try {
      const result = await SendIntent.checkSendIntentReceived();
      // const isCompany =  this.appUserQuery.isShareIn()
      const isCompany = localStorage.getItem('is_share_in');
      if (result) {
        console.log('SendIntent received');
        console.log(JSON.stringify(result));
        this.shareInData = JSON.stringify(result);
      }

      if (result.url && isCompany) {
        if (!this.containsURL(result.url as string)) {
          if (this.canCreateResource) {
            this.resourceDrawerService.openResourceDrawerInCreateMode();
            this.appUserStore.setIsReadingFiles(true);

            try {
              if (result.additionalItems) {
                const file_info = this.shareInService.getFileType(result);
                const file =
                  await this.shareInService.readFileInChunks(file_info);
              } else {
                const file = await this.shareInService.readFileInChunks(result);
                this.appUserStore.setIsReadingFiles(false);
              }
            } catch (error) {
              console.error('Error reading file:', error);
            }
            if (result.additionalItems) {
              for (const item of result.additionalItems) {
                try {
                  const file_info = this.shareInService.getFileType(item);
                  const file =
                    await this.shareInService.readFileInChunks(file_info);
                } catch (error) {
                  console.error('Error reading file:', error);
                }
              }
              this.appUserStore.setIsReadingFiles(false);
            }
          } else {
            this.notificationService.showNotification(
              'info',
              this.languageService.getInstantTranslation(
                'share_in.viewer_notification'
              )
            );
            setTimeout(() => {
              localStorage.setItem('is_share_in', '');
              this.appUserStore.setIsReadingFiles(false);
              // this.openApp();

              SendIntent.finish();
            }, 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error checking SendIntent:', error);
    }
  }

  containsURL(inputString: string): boolean {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(inputString);
  }
}
