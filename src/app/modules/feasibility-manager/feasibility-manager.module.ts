import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { FeasibilityManagerHeaderComponent } from 'src/app/utility/shared/components/feasibility-manager-header/feasibility-manager-header.component';
import { FeasibilityManagerReviewComponent } from './feasibility-manager-review/feasibility-manager-review.component';
import { FeasibilityManagerProjectsToActionComponent } from './feasibility-manager-projects-to-action/feasibility-manager-projects-to-action.component';
import { FeasibilityManagerProjectsInProgressComponent } from './feasibility-manager-projects-in-progress/feasibility-manager-projects-in-progress.component';
import { FeasibilityManagerProjectsCompletedComponent } from './feasibility-manager-projects-completed/feasibility-manager-projects-completed.component';
import { FeasibilityManagerComponent } from './feasibility-manager.component';



@NgModule({
  declarations: [
    FeasibilityManagerProjectsToActionComponent,
    FeasibilityManagerProjectsInProgressComponent,
    FeasibilityManagerProjectsCompletedComponent,
    FeasibilityManagerReviewComponent,
    FeasibilityManagerHeaderComponent,
    FeasibilityManagerComponent
  ],
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
  ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeasibilityManagerModule { }
