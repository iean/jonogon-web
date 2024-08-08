import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';
import { LanguageWrapperService } from '../../services/language-wrapper.service';
import { Router } from '@angular/router';
import { FeatureAddOnCode } from '../../models/feature.model';
import { CustomerService } from '../../services/customer.service';
import { ConfirmationService } from 'primeng/api';
import { Capacitor } from '@capacitor/core';
import { InAppPurchaseService } from '../../services/purchase.service';
import { PermissionService } from '../../services/permission.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { CommonAddOnsService } from '../../services/common-add-ons.service';
import { CardModule } from 'primeng/card';
import { ScreenTypeService } from '../../services/screen-type.service';

@Component({
  selector: 'eino-common-addons-popup',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    AccordionModule,
    TranslateModule,
    DividerModule,
    CardModule,
  ],
  providers: [DialogService],
  templateUrl: './common-addons-popup.component.html',
  styleUrls: ['./common-addons-popup.component.scss'],
})
export class CommonAddonsPopupComponent implements OnInit {
  @Input() message!: string;
  @Input() addOnCode!: FeatureAddOnCode;
  @Input() defaultView!: boolean;

  isPurchaseLoading = false;
  isAddCartLoading = false;
  canPurchaseAddon = this.permissionService.hasPermission('PURCHASE_ADDONS');
  canAddToCart = this.permissionService.hasPermission('ADD_ITEMS_IN_CART');
  isWeb = Capacitor.getPlatform() === 'web';
  showMoreContentVisible = false;
  isFeatureMessage = true;
  title: string | null = null;
  panels: any[] = [];
  carouselImages: any;

  platform: string = Capacitor.getPlatform();

  isMobile = false;
  innerWidth = 0;
  constructor(
    private customerService: CustomerService,
    private permissionService: PermissionService,
    private notificationService: NotificationService,
    private languageService: LanguageWrapperService,
    private router: Router,
    private inAppPurchaseService: InAppPurchaseService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig,
    private commonAddonService: CommonAddOnsService,
    public dialogRef: DynamicDialogRef,
    public screenTypeService: ScreenTypeService
  ) {
    this.setCarouselImages();
  }

  ngOnInit() {
    this.title = this.config.data.addOnCode;
    if (this.config.data?.defaultView === true) {
      this.toggleShowMore();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleShowMore() {
    this.showMoreContentVisible = !this.showMoreContentVisible;
    this.isFeatureMessage = false;

    if (this.config.data.addOnCode === 'ADD-10GB-STORAGE') {
      const addonsTitles = [
        'ADD-10GB-STORAGE',
        'ADD-100GB-STORAGE',
        'ADD-500GB-STORAGE',
        'ADD-1TB-STORAGE',
        'ADD-3TB-STORAGE',
        'ADD-5TB-STORAGE',
      ];
      this.panels = [];
      this.panels = addonsTitles.map((title) => ({
        active: false,
        name: 'addons.' + title + '.subtitle',
        message: 'addons.' + title + '.description_1',
        image:
          title && this.carouselImages[title]
            ? this.carouselImages[title][0]
            : null,
      }));
    } else {
      this.title = this.config.data?.addOnCode;
      this.panels = [
        {
          active: true,
          name: 'addons.' + (this.title || '') + '.subtitle',
          message: 'addons.' + (this.title || '') + '.description_1',
          image:
            this.title && this.carouselImages[this.title]
              ? this.carouselImages[this.title][0]
              : null,
        },
      ];
    }
  }

  purchaseAddOn() {
    if (this.platform === 'android' || this.platform === 'ios') {
      this.inAppPurchaseService.buyAddonsUsingInAppPurchase(
        this.config.data?.addOnCode
      );
    }

    if (this.platform === 'web') {
      this.isPurchaseLoading = true;
      this.customerService
        .purchaseAddOn([
          { addon_code: this.config.data?.addOnCode, quantity: 1 },
        ])
        .subscribe(
          (res) => {
            window.location.href = res.data.url;
            this.isPurchaseLoading = false;
          },
          () => {
            this.notificationService.showNotification(
              'error',
              this.languageService.getInstantTranslation('cart.error')
            );
            this.isPurchaseLoading = false;
          }
        );
    }
  }

  addToCart() {
    this.isAddCartLoading = true;
    this.closeDialog();
    this.customerService.addCartItem([this.config.data?.addOnCode]).subscribe(
      () => {
        this.notificationService.showConfirmationPopup(
          'success',
          this.languageService.getInstantTranslation('cart.cart_added'),
          this.languageService.getInstantTranslation('cart.add_cart_web'),
          () => {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['user/cart']);
              });

            this.notificationService.closeNotification();
          },
          () => {},
          {
            confirmButtonText:
              this.languageService.getInstantTranslation('cart.go_to_cart'),
            showCancelButton: false,
          }
        );
        this.isAddCartLoading = false;
      },
      () => {
        this.confirmationService.confirm({
          header: 'Error',
          message: this.languageService.getInstantTranslation('cart.error'),
          accept: () => {},
          reject: () => {},
        });
        this.isAddCartLoading = false;
      }
    );
  }

  setCarouselImages() {
    this.carouselImages = {
      'ADD-10GB-STORAGE': ['/assets/images/addons/addons_bg.png'],
      'ADD-100GB-STORAGE': ['/assets/images/addons/addons_bg.png'],
      'ADD-500GB-STORAGE': ['/assets/images/addons/addons_bg.png'],
      'ADD-1TB-STORAGE': ['/assets/images/addons/addons_bg.png'],
      'ADD-3TB-STORAGE': ['/assets/images/addons/addons_bg.png'],
      'ADD-5TB-STORAGE': ['/assets/images/addons/addons_bg.png'],
      'UNLIMITED-QR': ['/assets/images/addons/unlimited-qr.png'],
      'UNLIMITED-QM': [
        '/assets/images/addons/qm_img.svg',
        '/assets/images/addons/addons_bg.png',
      ],
      'UNLIMTED-UPLOAD': ['/assets/images/addons/unlimited-upload.png'],
      'WHITE-LABELLING': ['/assets/images/addons/whitelabeling.png'],
      'ADD-10GB-STORAGE-Y': ['/assets/images/addons/addons_bg.png'],
      'ADD-100GB-STORAGE-Y': ['/assets/images/addons/addons_bg.png'],
      'ADD-500GB-STORAGE-Y': ['/assets/images/addons/addons_bg.png'],
      'ADD-1TB-STORAGE-Y': ['/assets/images/addons/addons_bg.png'],
      'ADD-3TB-STORAGE-Y': ['/assets/images/addons/addons_bg.png'],
      'ADD-5TB-STORAGE-Y': ['/assets/images/addons/addons_bg.png'],
      'UNLIMITED-QR-Y': ['/assets/images/addons/unlimited-qr.png'],
      'UNLIMITED-QM-Y': [
        '/assets/images/addons/qm_img.svg',
        '/assets/images/addons/addons_bg.png',
      ],
      'UNLIMTED-UPLOAD-Y': ['/assets/images/addons/unlimited-upload.png'],
      'WHITE-LABELLING-Y': ['/assets/images/addons/whitelabeling.png'],
      'QM-EXIM-01': [
        '/assets/images/addons/qm_img.svg',
        '/assets/images/addons/addons_bg.svg',
      ],
      'QM-EXIM-01-Y': [
        '/assets/images/addons/qm_img.svg',
        '/assets/images/addons/addons_bg.svg',
      ],
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkMobile();
  }
  checkMobile() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 480) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  goBack() {
    this.isFeatureMessage = true;
    this.showMoreContentVisible = false;
  }
}
