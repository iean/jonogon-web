import { Query } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { UIState, UIStore } from './ui.store';

/**
 * Local store for
 */
@Injectable({ providedIn: 'root' })
export class UIQuery extends Query<UIState> {
  constructor(protected override store: UIStore) {
    super(store);
  }
}
