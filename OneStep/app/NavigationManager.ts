import { PageType, AppState } from '../types/AppTypes';
import { AppController } from './AppController';

export class NavigationManager {
  private app: AppController;
  private readonly pageOrder: ReadonlyArray<PageType> = ['needs', 'world', 'character', 'plot', 'rules', 'style'];

  constructor(appController: AppController) {
    this.app = appController;
  }

  public navigateTo(targetPage: PageType): void {
    const currentNavState = this.app.getState().navigation;
    if (currentNavState.currentPage === targetPage) return;

    const newNavState: AppState['navigation'] = {
      ...currentNavState,
      currentPage: targetPage,
    };
    
    const currentIndex = this.pageOrder.indexOf(targetPage);
    newNavState.canNavigateBack = currentIndex > 0;
    newNavState.canNavigateForward = currentIndex < this.pageOrder.length - 1;

    this.app.setState({ navigation: newNavState });
  }

  public navigateNext(): void {
    const { currentPage } = this.app.getState().navigation;
    const currentIndex = this.pageOrder.indexOf(currentPage);
    if (currentIndex < this.pageOrder.length - 1) {
      this.navigateTo(this.pageOrder[currentIndex + 1]);
    }
  }

  public navigatePrevious(): void {
    const { currentPage } = this.app.getState().navigation;
    const currentIndex = this.pageOrder.indexOf(currentPage);
    if (currentIndex > 0) {
      this.navigateTo(this.pageOrder[currentIndex - 1]);
    }
  }

  public getPageOrder(): ReadonlyArray<PageType> {
    return this.pageOrder;
  }
}