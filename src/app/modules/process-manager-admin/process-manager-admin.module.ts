import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ProcessManagerAdminRoutingModule } from './process-manager-admin.routing.module';
import { ProcessManagerHeaderComponent } from 'src/app/utility/shared/components/process-manager-header/process-manager-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ToDoTasksProcessManagerComponent } from './to-do-tasks-process-manager/to-do-tasks-process-manager.component';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { ProcessManagerTrackerComponent } from './process-manager-tracker/process-manager-tracker.component';
import { ProcessManagerTrackerProjectDetailsComponent } from './process-manager-tracker-project-details/process-manager-tracker-project-details.component';

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
    SharedModule,
  ],
  declarations: [
    ProcessManagerAdminComponent,
    ProcessManagerHeaderComponent,
    ToDoTasksProcessManagerComponent,
    ProcessManagerTrackerComponent,
    ProcessManagerTrackerProjectDetailsComponent
  ],
   providers: [NgbActiveModal], 
  exports: [ToDoTasksProcessManagerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProcessManagerAdminModule { }
