import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IViewSwitchOption, ViewType } from '../../models/request.model';
import {
  SelectButtonChangeEvent,
  SelectButtonModule,
} from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'eino-view-switch',
  standalone: true,
  imports: [CommonModule, ButtonModule, SelectButtonModule, FormsModule],
  templateUrl: './view-switch.component.html',
  styleUrls: ['./view-switch.component.scss'],
})
export class ViewSwitchComponent {
  @Input() view: ViewType = 'CARD';

  @Output() viewChanged: EventEmitter<ViewType> = new EventEmitter<ViewType>();

  viewType!: string;

  options: IViewSwitchOption[] = [
    { icon: 'ri-dashboard-line', value: 'CARD' },
    { icon: 'ri-list-check', value: 'LIST' },
  ];

  constructor() {}

  viewUpdated(event: SelectButtonChangeEvent) {
    this.viewChanged.emit(event.value);
  }
}
