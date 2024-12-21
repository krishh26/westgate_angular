import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ProcessManagerAdminRoutingModule } from './process-manager-admin.routing.module';
import { ProcessManagerHeaderComponent } from 'src/app/utility/shared/components/process-manager-header/process-manager-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    ProcessManagerAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule,
  ],
  declarations: [
    ProcessManagerAdminComponent,
    ProcessManagerHeaderComponent
  ]
})
export class ProcessManagerAdminModule { }
