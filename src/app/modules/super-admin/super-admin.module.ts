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
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { ProjectMailSendComponent } from './projectMailSend/projectMailSend.component';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { StatusWiseTrackerComponent } from './status-wise-tracker/status-wise-tracker.component';
import { TrackerWiseProjectDetailsComponent } from './tracker-wise-project-details/tracker-wise-project-details.component';
import { GapAnalysisComponent } from './gap-analysis/gap-analysis.component';
import { MyDayTasksComponent } from './my-day-tasks/my-day-tasks.component';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApproveRejectProjectComponent } from './approve-reject-project/approve-reject-project.component';
import { SuperAdminUserProfileComponent } from './super-admin-user-profile/super-admin-user-profile.component';
import { SuperAdminChangePasswordComponent } from './super-admin-change-password/super-admin-change-password.component';
import { DropAfterFesibilityProjectsComponent } from './drop-after-fesibility-projects/drop-after-fesibility-projects.component';
import { NoSupplierMatchProjectsComponent } from './no-supplier-match-projects/no-supplier-match-projects.component';
import { ApproveRejectProjectDetailsComponent } from './approve-reject-project-details/approve-reject-project-details.component';
import { TypeWiseProjectListComponent } from './type-wise-project-list/type-wise-project-list.component';
import { FailAproveRejectComponent } from './fail-aprove-reject/fail-aprove-reject.component';
import { ExpertiseListComponent } from './expertise-list/expertise-list.component';
import { ExpertiseViewComponent } from './expertise-view/expertise-view.component';
import { SubExpertiseListComponent } from './sub-expertise-list/sub-expertise-list.component';
import { ResourcesAddComponent } from './resources-add/resources-add.component';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import { ResourcesViewComponent } from './resources-view/resources-view.component';
import { ResourcesAddBulkComponent } from './resources-add-bulk/resources-add-bulk.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { SubExpertiseViewComponent } from './sub-expertise-view/sub-expertise-view.component';
import { ResourcesViewDetailsComponent } from './resources-view-details/resources-view-details.component';
import { RoleWiseResourcesListComponent } from './role-wise-resources-list/role-wise-resources-list.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { TeamProductivityViewComponent } from './team-productivity-view/team-productivity-view.component';
import { ResourcesProductivityViewComponent } from './resources-productivity-view/resources-productivity-view.component';
import { TodoTaskViewPageComponent } from './todo-task-view-page/todo-task-view-page.component';
import { NgxEditorModule } from 'ngx-editor';
import { ResourcesCommentModalComponent } from './resources-comment-modal/resources-comment-modal.component';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { SupplierWiseProjectListComponent } from './supplier-wise-project-list/supplier-wise-project-list.component';
import { FilterNonZeroCountsPipe } from '../../pipes/filter-non-zero-counts.pipe';
import { AdminDataSettingsComponent } from './admin-data-settings/admin-data-settings.component';
import { AdminDataExpertiseListComponent } from './admin-data-expertise-list/admin-data-expertise-list.component';
import { AdminDataCandidateListComponent } from './admin-data-candidate-list/admin-data-candidate-list.component';
import { AdminDataEditCandidateComponent } from './admin-data-edit-candidate/admin-data-edit-candidate.component';
import { RoleAdminCandidateListComponent } from './role-admin-candidate-list/role-admin-candidate-list.component';
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
    SupplierUserProfileEditComponent,
    ProjectMailSendComponent,
    TodoTasksComponent,
    StatusWiseTrackerComponent,
    TrackerWiseProjectDetailsComponent,
    GapAnalysisComponent,
    MyDayTasksComponent,
    CompletedTasksComponent,
    ApproveRejectProjectComponent,
    SuperAdminUserProfileComponent,
    SuperAdminChangePasswordComponent,
    DropAfterFesibilityProjectsComponent,
    NoSupplierMatchProjectsComponent,
    ApproveRejectProjectDetailsComponent,
    TypeWiseProjectListComponent,
    FailAproveRejectComponent,
    ExpertiseListComponent,
    ExpertiseViewComponent,
    SubExpertiseListComponent,
    ResourcesAddComponent,
    ResourcesListComponent,
    ResourcesAddBulkComponent,
    SubExpertiseViewComponent,
    ResourcesViewDetailsComponent,
    RoleWiseResourcesListComponent,
    RolesListComponent,
    ResourcesViewComponent,
    TeamProductivityViewComponent,
    ResourcesProductivityViewComponent,
    TodoTaskViewPageComponent,
    AddRolesComponent,
    EditRolesComponent,
    ResourcesCommentModalComponent,
    TimeFormatPipe,
    SupplierWiseProjectListComponent,
    FilterNonZeroCountsPipe,
    AdminDataSettingsComponent,
    AdminDataExpertiseListComponent,
    AdminDataCandidateListComponent,
    AdminDataEditCandidateComponent,
    RoleAdminCandidateListComponent
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
    NgxExtendedPdfViewerModule,
    NgxSpinnerModule,
    NgxEditorModule,

  ],
  providers: [NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SuperAdminModule { }
