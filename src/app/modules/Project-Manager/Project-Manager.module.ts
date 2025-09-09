import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectManagerComponent } from './Project-Manager.component';
import { ProjectManagerRoutingModule } from './project-manager.routing.module';
import { ProjectManagerHeaderComponent } from 'src/app/utility/shared/components/project-manager-header/project-manager-header.component';
import { ProjectMangerHeaderTwoComponent } from 'src/app/utility/shared/components/project-manger-header-two/project-manger-header-two.component';
import { ProjectManagerHomeComponent } from './project-manager-home/project-manager-home.component';
import { ProjectManagerCloseProjectListComponent } from './project-manager-close-project-list/project-manager-close-project-list.component';
import { ProjectManagerAllProjectListComponent } from './project-manager-all-project-list/project-manager-all-project-list.component';
import { ProjectManagerMatchProjectListComponent } from './project-manager-match-project-list/project-manager-match-project-list.component';
import { AllProjectDetailsComponent } from './all-project-details/all-project-details.component';
import { MatchProjectDetailsComponent } from './match-project-details/match-project-details.component';
import { ProjectCloseDetailsComponent } from './project-close-details/project-close-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectManagerSummaryDetailComponent } from './project-manager-summary-detail/project-manager-summary-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProjectMangerProfileComponent } from './project-manger-profile/project-manger-profile.component';
import { PmShortlistedProjectsComponent } from 'src/app/modules/Project-Manager/pm-shortlisted-projects/pm-shortlisted-projects.component';
import { PmCaseStudiesComponent } from 'src/app/modules/Project-Manager/pm-case-studies/pm-case-studies.component';
import { SummaryNotesComponent } from './summary-notes/summary-notes.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ProjectShortlistedDetailsComponent } from './project-shortlisted-details/project-shortlisted-details.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NewAllProjectDetailsComponent } from './new-all-project-details/new-all-project-details.component';
import { ExpiredProjectListComponent } from './expired-project-list/expired-project-list.component';
import { ExpiredProjectDetailsComponent } from './expired-project-details/expired-project-details.component';
import { ShortlistedSupplierProjectDetailsComponent } from './shortlisted-supplier-project-details/shortlisted-supplier-project-details.component';
import { ShortlistedSupplierProjectListComponent } from './shortlisted-supplier-project-list/shortlisted-supplier-project-list.component';
import { BOSUserModule } from '../bos-user/bos-user.module';
import { ProjectManagerCompletedComponent } from './project-manager-completed/project-manager-completed.component';
import { ProjectManagerInProgressComponent } from './project-manager-in-progress/project-manager-in-progress.component';
import { ProjectManagerToActionComponent } from './project-manager-to-action/project-manager-to-action.component';
import { ProjectManagerProjectDetailsComponent } from './project-manager-project-details/project-manager-project-details.component';
import { ProjectManagerFailedProjectComponent } from './project-manager-failed-project/project-manager-failed-project.component';
import { PmChangePasswordComponent } from './pm-change-password/pm-change-password.component';
import { CompletedProjectDetailsComponent } from './completed-project-details/completed-project-details.component';
import { AddEditProjectComponent } from './add-edit-project/add-edit-project.component';
import { NgxEditorModule } from 'ngx-editor';
import { ExpertiseViewBidManagerComponent } from './expertise-view-bid-manager/expertise-view-bid-manager.component';
import { SubExpertiseViewBidManagerComponent } from './sub-expertise-view-bid-manager/sub-expertise-view-bid-manager.component';
import { InterestedSupplierWiseProjectsComponent } from './interested-supplier-wise-projects/interested-supplier-wise-projects.component';
import { ProjectManagerCaseStudiesComponent } from './project-manager-case-studies/project-manager-case-studies.component';
import { TaskDetailsBidManagerWiseComponent } from './task-details-bid-manager-wise/task-details-bid-manager-wise.component';
@NgModule({
  imports: [
    CommonModule,
    ProjectManagerRoutingModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule,
    BOSUserModule,
    NgxEditorModule
  ],
  declarations: [
    ProjectManagerComponent,
    ProjectManagerHomeComponent,
    ProjectManagerHeaderComponent,
    ProjectMangerHeaderTwoComponent,
    ProjectManagerCloseProjectListComponent,
    ProjectManagerAllProjectListComponent,
    ProjectManagerMatchProjectListComponent,
    AllProjectDetailsComponent,
    MatchProjectDetailsComponent,
    ProjectCloseDetailsComponent,
    ProjectManagerSummaryDetailComponent,
    ProjectMangerProfileComponent,
    PmShortlistedProjectsComponent,
    PmCaseStudiesComponent,
    SummaryNotesComponent,
    ProjectShortlistedDetailsComponent,
    NewAllProjectDetailsComponent,
    ExpiredProjectListComponent,
    ExpiredProjectDetailsComponent,
    ShortlistedSupplierProjectDetailsComponent,
    ShortlistedSupplierProjectListComponent,
    ProjectManagerCompletedComponent,
    ProjectManagerInProgressComponent,
    ProjectManagerToActionComponent,
    ProjectManagerProjectDetailsComponent,
    ProjectManagerFailedProjectComponent,
    PmChangePasswordComponent,
    CompletedProjectDetailsComponent,
    AddEditProjectComponent,
    ExpertiseViewBidManagerComponent,
    SubExpertiseViewBidManagerComponent,
    InterestedSupplierWiseProjectsComponent,
    ProjectManagerCaseStudiesComponent,
    TaskDetailsBidManagerWiseComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
})
export class ProjectManagerModule {}
