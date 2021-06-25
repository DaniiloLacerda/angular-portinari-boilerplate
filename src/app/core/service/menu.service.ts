// @ts-ignore: Unreachable code error

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PoMenuItem } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {
    this.menuSubject = new BehaviorSubject<Array<PoMenuItem>>(
      Object.assign(new Array<PoMenuItem>(), this.mainMenu)
    );
    this.menu = this.menuSubject.asObservable();
    this.menuCollapsed = new BehaviorSubject<boolean>(
      Object.assign(new Boolean(), this.collapsedMenu)
    );
    this.collapsed = this.menuCollapsed.asObservable();
  }
  private menuCollapsed: BehaviorSubject<boolean>;
  public collapsed: Observable<boolean>;
  private menuSubject: BehaviorSubject<Array<PoMenuItem>>;
  public menu: Observable<Array<PoMenuItem>>;
  private mainMenu: Array<PoMenuItem>;
  private collapsedMenu = true;

  private menuRegistrations: PoMenuItem = {
    label: 'Cadastros',
    icon: 'po-icon po-icon-plus',
    subItems: [],
    shortLabel: 'Cadastros',
  };

  private subMenuRegistrations: Array<PoMenuItem> = [
    { label: 'Categorias', link: 'category' },
    { label: 'Produtos', link: 'product' },
  ];

  private menuReports: PoMenuItem = {
    label: 'Relatórios',
    link: 'report',
    icon: 'po-icon po-icon-sale',
    shortLabel: 'Relatórios',
  };

  public async setMenu() {
    await this.constructorMenu();
    this.menuSubject.next(this.mainMenu);
  }

  public menuDestroy() {
    this.menuSubject.next(undefined as any);
    this.mainMenu = [];
  }

  private async constructorMenu() {
    this.mainMenu = [];
    this.mainMenu.push({ label: 'Home', link: '/', icon: 'po-icon-home', shortLabel: 'Home' });
    this.constructorMenuItem(this.menuRegistrations, this.subMenuRegistrations);
    this.constructorMenuItem(this.menuReports);
  }

  private constructorMenuItem(menu: PoMenuItem, submenu?: Array<PoMenuItem>) {
    const menuItem = menu;
    menuItem.subItems = submenu;
    this.mainMenu.push(menuItem);
  }

  public collapseMenu() {
    this.collapsedMenu = true;
    this.menuCollapsed.next(Object.assign(new Boolean(), this.collapsedMenu));
  }
}
