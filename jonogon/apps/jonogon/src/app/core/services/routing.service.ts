import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}

  routeToSubModule(route: string, module: string, context: string) {
    this.router.navigate([`/${context}/${module}/${route}`]);
  }
}
