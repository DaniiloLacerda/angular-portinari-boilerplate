import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PoHttpInterceptorModule, PoHttpRequestModule, PoModule } from '@po-ui/ng-components';
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { CoreModule } from '@core/core.module';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptor/auth.interceptor';
import { ErrorInterceptor } from '@core/interceptor/error.interceptor';
import { LoaderInterceptor } from '@core/interceptor/loader.interceptor';

registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    CoreModule,
    SharedModule,
    PoTemplatesModule,
    PoHttpRequestModule,
    PoHttpInterceptorModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DatePipe },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
