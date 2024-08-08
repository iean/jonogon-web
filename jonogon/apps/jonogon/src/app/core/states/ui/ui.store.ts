import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export enum SidebarState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MINIMIZED = 'MINIMIZED',
}

export interface UIState {
  isSidebarOpen: boolean;
  sidebarState: SidebarState;
}

/**
 *
 * @returns the current state of the UI
 */
export function createInitialState(): UIState {
  return {
    isSidebarOpen: false,
    sidebarState: SidebarState.CLOSED,
  };
}

/**
 * Manages the state of the UI.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ui', resettable: true })
export class UIStore extends Store<UIState> {
  constructor() {
    super(createInitialState());
  }
}
