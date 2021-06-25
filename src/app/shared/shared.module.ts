import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoModule,
  PoNavbarModule,
  PoNotificationModule,
  PoDynamicModule,
  PoStepperModule,
  PoBreadcrumbModule,
  PoLoadingModule,
  PoChartModule,
  PoDividerModule,
  PoAccordionModule,
} from '@po-ui/ng-components';

const POModules = [
  PoModule,
  PoNavbarModule,
  PoNotificationModule,
  PoDynamicModule,
  PoStepperModule,
  PoBreadcrumbModule,
  PoLoadingModule,
  PoStepperModule,
  PoChartModule,
  PoDividerModule,
  PoAccordionModule,
];

const othersModels = [FormsModule];
@NgModule({
  declarations: [],
  imports: [CommonModule, POModules, othersModels],
  exports: [CommonModule, POModules, othersModels],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
