import { Component, ViewChild, OnInit } from '@angular/core';
import {
  PoMenuItem,
  PoToolbarAction,
  PoToolbarProfile,
  PoMenuComponent,
} from '@po-ui/ng-components';
import { AuthService } from '@core/service/auth.service';
import { LoaderService } from '@shared/base/loader.service';
import { MenuService } from '@core/service/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private loadingService: LoaderService,
    private menuService: MenuService
  ) {
    this.authService.currentUser.subscribe((x) => (this.isLogged = x != null));
    this.authService.currentUser.subscribe(
      (x) =>
        (this.profile = {
          avatar: '',
          title: `${x?.name}`,
        })
    );
    this.loadingService.isLoading.subscribe((load) =>
      setTimeout(() => (this.isLoading = load), 0)
    );
    this.loadingService.isPublicPage.subscribe((pubPage) => (this.isPublic = pubPage));
    this.menuService.menu.subscribe((m) => (this.menu = m));
  }

  ngOnInit(): void {
    this.menuService.collapsed.subscribe((c) => {
      if (c) {
        this.poMenu.collapse();
      }
    });
  }

  @ViewChild(PoMenuComponent, { static: true }) poMenu: PoMenuComponent;

  public menu: Array<PoMenuItem>;
  public profile: PoToolbarProfile;
  public filter: boolean;
  public logo = '../assets/icons/po-icon.png';
  public isLoading: boolean;
  public isPublic: boolean;
  public isLogged: boolean;
  public appTitle = 'PO ANGULAR';

  profileActions: Array<PoToolbarAction> = [
    {
      icon: 'po-icon-exit',
      label: 'Sair',
      type: 'danger',
      url: 'exit',
      separator: true,
      action: this.logout.bind(this),
    },
  ];

  logout(): void {
    this.menuService.menuDestroy();
    this.authService.logout();
  }
}
