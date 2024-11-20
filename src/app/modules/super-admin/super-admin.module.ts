import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminComponent } from './super-admin.component';
import { SuperadminHeaderComponent } from 'src/app/utility/shared/components/superadmin-header/superadmin-header.component';
import { SuperAdminRoutingModule } from './super-admin.routing.module';
import { SuperAdminProjectsAllComponent } from './super-admin-projects-all/super-admin-projects-all.component';
import { SuperAdminSupplierComponent } from './super-admin-supplier/super-admin-supplier.component';
import { SuperAdminSupplierProjectViewComponent } from './super-admin-supplier-project-view/super-admin-supplier-project-view.component';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuperAdminProjectDetailsComponent } from './super-admin-project-details/super-admin-project-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SuperAdminSupplierDetailsComponent } from './super-admin-supplier-details/super-admin-supplier-details.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { SuperadminAddProjectComponent } from './superadmin-add-project/superadmin-add-project.component';
import { SuperadminCommentModalComponent } from './superadmin-comment-modal/superadmin-comment-modal.component';
import { RegisterNewSupplierComponent } from './register-new-supplier/register-new-supplier.component';
import { CaseStudyBulkAddComponent } from './case-study-bulk-add/case-study-bulk-add.component';
import { AdminCaseStudiesListComponent } from './admin-case-studies-list/admin-case-studies-list.component';
import { AdminAddCaseStudyComponent } from './admin-add-case-study/admin-add-case-study.component';
import { SupplierManageUserListComponent } from './supplier-manage-user-list/supplier-manage-user-list.component';
import { SupplierUserProfileDataComponent } from './supplier-user-profile-data/supplier-user-profile-data.component';
import { SupplierUserActivityComponent } from './supplier-user-activity/supplier-user-activity.component';
import { SupplierUserProfileEditComponent } from './supplier-user-profile-edit/supplier-user-profile-edit.component';



@NgModule({
  declarations: [
    SuperAdminComponent,
    SuperadminHeaderComponent,
    SuperAdminProjectsAllComponent,
    SuperAdminSupplierComponent,
    SuperAdminSupplierProjectViewComponent,
    SuperAdminProjectDetailsComponent,
    SuperAdminSupplierDetailsComponent,
    SuperAdminDashboardComponent,
    SuperadminAddProjectComponent,
    SuperadminCommentModalComponent,
    RegisterNewSupplierComponent,
    CaseStudyBulkAddComponent,
    AdminCaseStudiesListComponent,
    AdminAddCaseStudyComponent,
    SupplierManageUserListComponent,
    SupplierUserProfileDataComponent,
    SupplierUserActivityComponent,
    SupplierUserProfileEditComponent 
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SuperAdminRoutingModule,
    NgSelectModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SuperAdminModule { }
