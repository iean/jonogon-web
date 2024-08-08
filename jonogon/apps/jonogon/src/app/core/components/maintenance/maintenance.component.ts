import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eino-maintenance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
})
export class MaintenanceComponent {
  enMessage = {
    heading: `EINO will be undergoing scheduled maintenance`,
    paragraph: `This update will bring more special features for you. Please check back soon.`,
  };

  deMessage = {
    heading: `EINO wird einer planmäßigen Wartung unterzogen`,
    paragraph: `Dieses Update wird weitere spezielle Funktionen für dich bringen. Bitte schau bald wieder vorbei.`,
  };

  messages = {
    en: this.enMessage,
    de: this.deMessage,
  };

  activeLang: 'en' | 'de' =
    (localStorage.getItem('currentLanguage') as 'en' | 'de') ?? 'de';
  activeMessage = this.messages[this.activeLang];

  changeMessageToEn() {
    this.activeLang = 'en';
    this.activeMessage = this.enMessage;
  }

  changeMessageToDe() {
    this.activeLang = 'de';
    this.activeMessage = this.deMessage;
  }
}
