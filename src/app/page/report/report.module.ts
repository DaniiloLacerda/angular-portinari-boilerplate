import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportRoutingModule } from './report-rounting.module';
import { ReportComponent } from './report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [SharedModule, ReportRoutingModule],
})
export class ReportModule {}
