import { Location } from '@angular/common';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private backNavigation: string | null = null;
  public readonly headerTitle = signal('');
  constructor(
    private location: Location,
    private router: Router
  ) {}

  public setBackNavigation(path: string): void {
    this.backNavigation = path;
  }

  public setHeaderTitle(title: string): void {
    this.headerTitle.set(title);
  }

  public goBack(): void {
    if (this.backNavigation) {
      this.router.navigate([this.backNavigation]);
      this.backNavigation = null;
    } else {
      this.location.back();
    }
  }
}
