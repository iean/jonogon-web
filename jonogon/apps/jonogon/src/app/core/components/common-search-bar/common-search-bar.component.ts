import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PermissionService } from '../../services/permission.service';
import { FeatureService } from '../../services/feature.service';
import { QRCodeService } from 'module/qrcode/src/lib/services/qr-code.service';
import { FeatureAddOnCode } from '../../models/feature.model';
import { CommonAddOnsService } from '../../services/common-add-ons.service';
import { LanguageWrapperService } from '../../services/language-wrapper.service';

@Component({
  selector: 'eino-search-bar',
  templateUrl: './common-search-bar.component.html',
  standalone: true,
  imports: [InputTextModule, ButtonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./common-search-bar.component.css'],
})
export class CommonSearchBarComponent implements OnInit {
  @Input() addButtonText: string | undefined;
  @Input() placeHolderText: string | undefined;
  @Input() searchControl!: FormControl;
  @Output() addButtonClicked: EventEmitter<string> = new EventEmitter<string>();

  searchInput: string | undefined;
  canCerateQR: boolean = false;
  constructor(
    private permissionService: PermissionService,
    private featureService: FeatureService,
    private qrCodeService: QRCodeService,
    private commonAddonService: CommonAddOnsService,
    private languageService: LanguageWrapperService
  ) {}

  ngOnInit() {
    console.log('Common Search Bar');
    this.canCerateQR = this.permissionService.hasPermission(
      'CREATE_GENERAL_QRCODES'
    );
  }

  operationAddButtonClicked() {
    const isQRAddonPurchased = this.featureService.isFeatureAvailable(
      FeatureAddOnCode.QR_UNLIMITED
    );
    this.qrCodeService.getTotalActiveQRCodeCount().subscribe((res) => {
      const numberOfQRCodes = res.data;
      if (numberOfQRCodes >= 3 && !isQRAddonPurchased) {
        this.commonAddonService.showAddOnPurchaseModal(
          this.languageService.getInstantTranslation(
            'free_user_limitation.qr_code_limit'
          ),
          FeatureAddOnCode.QR_UNLIMITED
        );
      } else {
        this.addButtonClicked.emit('');
      }
    });
  }
}
