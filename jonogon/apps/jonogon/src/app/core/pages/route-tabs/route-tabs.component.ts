import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { HeaderService } from '../../services/header.service';
import { Observable } from 'rxjs';

interface Tab {
  title: string;
  path: string;
  isEnabled: () => Observable<boolean>;
}

@Component({
  selector: 'jonogon-tabs',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    TranslateModule,
    CardModule,
  ],
  templateUrl: './route-tabs.component.html',
  styleUrls: ['./route-tabs.component.scss'],
})
export class RouteTabsComponent implements OnInit {
  @Input({ required: true }) tabs: Tab[] = [];
  @Input() header?: string;
  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    if (this.header) this.headerService.setHeaderTitle(this.header);
  }
}
