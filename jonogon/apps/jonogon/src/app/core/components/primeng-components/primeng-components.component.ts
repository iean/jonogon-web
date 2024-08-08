import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuItem, Message } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TreeSelectModule } from 'primeng/treeselect';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { SliderModule } from 'primeng/slider';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'eino-primeng-components',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    PaginatorModule,
    InputSwitchModule,
    RadioButtonModule,
    CheckboxModule,
    ProgressBarModule,
    ToastModule,
    PasswordModule,
    TooltipModule,
    MenuModule,
    ProgressSpinnerModule,
    TagModule,
    SliderModule,
    AccordionModule,
    ConfirmDialogModule,
    MessagesModule,
    PanelModule,
    StepsModule,
    TableModule,
    SplitButtonModule,
    SpeedDialModule,
    TabMenuModule,
    TranslateModule,
    CardModule,
    InputTextModule,
    TreeSelectModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    FileUploadModule,
  ],
  templateUrl: './primeng-components.component.html',
  styleUrls: ['./primeng-components.component.scss'],
})
export class PrimengComponentsComponent implements OnInit {
  checked: boolean = false;
  items: MenuItem[] | undefined;
  menus: MenuItem[] | undefined;
  customers: any;

  value: number = 50;

  sidebarVisible: boolean = false;
  constructor() {}
  messages: Message[] | undefined;

  ngOnInit() {
    this.customers = [{ s: 1 }, { s: 1 }, { s: 1 }, { s: 1 }, { s: 1 }];
    this.menus = [
      {
        icon: 'pi pi-pencil',
      },
      {
        icon: 'pi pi-refresh',
      },
      {
        icon: 'pi pi-trash',
      },
      {
        icon: 'pi pi-upload',
      },
      {
        icon: 'pi pi-external-link',
      },
    ];
    this.items = [
      {
        label: 'Personal',
        routerLink: 'personal',
      },
      {
        label: 'Seat',
        routerLink: 'seat',
      },
      {
        label: 'Payment',
        routerLink: 'payment',
      },
      {
        label: 'Confirmation',
        routerLink: 'confirmation',
      },
    ];
    this.messages = [
      { severity: 'success', summary: 'Success', detail: 'Message Content' },
    ];
  }

  inputSwitch() {
    console.log(this.checked);
  }

  first: number = 0;

  rows: number = 10;

  onPageChange(event: PaginatorState) {
    this.rows = event.rows as number;

    if (event.first === this.first) {
    }
    this.first = event.first as number;
  }
}
