import { Injectable } from '@angular/core';
import { SidebarState, UIStore } from '../states/ui/ui.store';
import { UIQuery } from '../states/ui/ui.query';
@Injectable({
  providedIn: 'root',
})
export class UIService {
  public sidebarState$ = this.uiQuery.select((state) => state.sidebarState);
  public isSidebarOpen$ = this.uiQuery.select((state) => state.isSidebarOpen);
  constructor(private uiStore: UIStore, private uiQuery: UIQuery) {}
  /**
   * Opens the sidebar.
   */
  public openSidebar() {
    this.uiStore.update({
      sidebarState: SidebarState.OPEN,
      isSidebarOpen: true,
    });
  }
  /**
   * Closes the sidebar.
   */
  public closeSidebar() {
    this.uiStore.update({
      sidebarState: SidebarState.CLOSED,
      isSidebarOpen: false,
    });
  }
  /**
   * Minimizes the sidebar.
   */
  public minimizeSidebar() {
    this.uiStore.update({
      sidebarState: SidebarState.MINIMIZED,
      isSidebarOpen: true,
    });
  }
}
