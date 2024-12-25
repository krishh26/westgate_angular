import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeasibilityManagerRoutingModule } from './feasibility-manager.routing.module';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BOSUserModule } from '../bos-user/bos-user.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeasibilityManagerRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule,
    BOSUserModule
  ]
})
export class FeasibilityManagerModule { }
