import { Component, Input, OnInit } from '@angular/core';
import { NgStyle, UpperCasePipe } from '@angular/common';

type ColorSet = { fg: string; bg: string };

@Component({
  selector: 'eino-user-avatar',
  standalone: true,
  imports: [NgStyle, UpperCasePipe],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Input({ required: true }) initials!: string;
  @Input() image?: string;
  @Input() shape: 'square' | 'circle' = 'square';
  color!: ColorSet;

  ngOnInit(): void {
    this.color = this.getColors(this.initials);
  }

  private seededRandomNumber(seedString: string): number {
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
      seed += seedString.charCodeAt(i);
    }
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  private getRandomIntWithSeed(min: number, max: number, seed: string): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.seededRandomNumber(seed) * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  private getColors(seed: string): ColorSet {
    const sets: { fg: string; bg: string }[] = [
      { fg: '#182345', bg: '#00a3bf' },
      { fg: '#fdfdfd', bg: '#00875a' },
      { fg: '#13294c', bg: '#ff991f' },
      { fg: '#fdfdfd', bg: '#172b4d' },
    ];

    const randomIndex = this.getRandomIntWithSeed(0, sets.length, seed);

    return sets[randomIndex];
  }
}
