import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagerComponent } from './Project-Manager.component';
import { ProjectManagerHomeComponent } from './project-manager-home/project-manager-home.component';
import { ProjectManagerAllProjectListComponent } from './project-manager-all-project-list/project-manager-all-project-list.component';
import { ProjectManagerCloseProjectListComponent } from './project-manager-close-project-list/project-manager-close-project-list.component';
import { ProjectManagerMatchProjectListComponent } from './project-manager-match-project-list/project-manager-match-project-list.component';
import { AllProjectDetailsComponent } from './all-project-details/all-project-details.component';
import { MatchProjectDetailsComponent } from './match-project-details/match-project-details.component';
import { ProjectCloseDetailsComponent } from './project-close-details/project-close-details.component';
import { ProjectManagerSummaryDetailComponent } from './project-manager-summary-detail/project-manager-summary-detail.component';
import { ProjectMangerProfileComponent } from './project-manger-profile/project-manger-profile.component';
import { PmCaseStudiesComponent } from 'src/app/modules/Project-Manager/pm-case-studies/pm-case-studies.component';
import { PmShortlistedProjectsComponent } from 'src/app/modules/Project-Manager/pm-shortlisted-projects/pm-shortlisted-projects.component';
import { SummaryNotesComponent } from './summary-notes/summary-notes.component';
import { ProjectShortlistedDetailsComponent } from './project-shortlisted-details/project-shortlisted-details.component';
import { NewAllProjectDetailsComponent } from './new-all-project-details/new-all-project-details.component';
import { ExpiredProjectListComponent } from './expired-project-list/expired-project-list.component';
import { ExpiredProjectDetailsComponent } from './expired-project-details/expired-project-details.component';
import { ShortlistedSupplierProjectDetailsComponent } from './shortlisted-supplier-project-details/shortlisted-supplier-project-details.component';
import { ShortlistedSupplierProjectListComponent } from './shortlisted-supplier-project-list/shortlisted-supplier-project-list.component';
import { TodoTasksComponent } from '../bos-user/todo-tasks/todo-tasks.component';
import { ProjectManagerToActionComponent } from './project-manager-to-action/project-manager-to-action.component';
import { ProjectManagerCompletedComponent } from './project-manager-completed/project-manager-completed.component';
import { ProjectManagerInProgressComponent } from './project-manager-in-progress/project-manager-in-progress.component';
import { ProjectManagerProjectDetailsComponent } from './project-manager-project-details/project-manager-project-details.component';
import { ProjectManagerFailedProjectComponent } from './project-manager-failed-project/project-manager-failed-project.component';
import { PmChangePasswordComponent } from './pm-change-password/pm-change-password.component';
import { CompletedProjectDetailsComponent } from './completed-project-details/completed-project-details.component';
import { AddEditProjectComponent } from './add-edit-project/add-edit-project.component';
import { ExpertiseViewBidManagerComponent } from './expertise-view-bid-manager/expertise-view-bid-manager.component';
import { SubExpertiseViewBidManagerComponent } from './sub-expertise-view-bid-manager/sub-expertise-view-bid-manager.component';
import { InterestedSupplierWiseProjectsComponent } from './interested-supplier-wise-projects/interested-supplier-wise-projects.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ProjectManagerHomeComponent,
  },
  {
    path: 'project',
    component: ProjectManagerComponent,
    children: [
      {
        path: 'all',
        component: ProjectManagerAllProjectListComponent,
      },
      {
        path: 'todo-task',
        component: TodoTasksComponent,
      },
      {
        path: 'change-password',
        component: PmChangePasswordComponent,
      },
      {
        path: 'expired-project-list',
        component: ExpiredProjectListComponent,
      },
      {
        path: 'expired-project-details',
        component: ExpiredProjectDetailsComponent,
      },
      {
        path: 'shortlisted-supplier-project-details',
        component: ShortlistedSupplierProjectDetailsComponent,
      },
      {
        path: 'shortlisted-supplier-project-list',
        component: ShortlistedSupplierProjectListComponent,
      },
      {
        path: 'match',
        component: ProjectManagerMatchProjectListComponent,
      },
      {
        path: 'close',
        component: ProjectManagerCloseProjectListComponent,
      },
      {
        path: 'details',
        component: AllProjectDetailsComponent,
      },
      {
        path: 'project-all-details',
        component: NewAllProjectDetailsComponent,
      },
      {
        path: 'match-project-details',
        component: MatchProjectDetailsComponent,
      },
      {
        path: 'close-project-details',
        component: ProjectCloseDetailsComponent,
      },
      {
        path: 'shortlisted-project-details',
        component: ProjectShortlistedDetailsComponent,
      },
      {
        path: 'summary-project-details',
        component: ProjectManagerSummaryDetailComponent,
      },
      {
        path: 'projectmanager-case-studies',
        component: PmCaseStudiesComponent,
      },
      {
        path: 'shortlisted',
        component: PmShortlistedProjectsComponent,
      },
      {
        path: 'summary-notes',
        component: SummaryNotesComponent,
      },
      {
        path: 'bid-manager-to-action',
        component: ProjectManagerToActionComponent,
      },
      {
        path: 'bid-manager-completed',
        component: ProjectManagerCompletedComponent,
      },
      {
        path: 'bid-manager-in-progress',
        component: ProjectManagerInProgressComponent,
      },
      {
        path: 'bid-manager-project-details',
        component: ProjectManagerProjectDetailsComponent,
      },
      {
        path: 'bid-manager-project-failed',
        component: ProjectManagerFailedProjectComponent,
      },
      {
        path: 'bid-manager-user-profile',
        component: ProjectMangerProfileComponent,
      },
      {
        path: "completed-project-details",
        component: CompletedProjectDetailsComponent
      },
      {
        path: "add-edit-project",
        component: AddEditProjectComponent
      },
      {
        path: "expertise-view-bid-manager",
        component: ExpertiseViewBidManagerComponent
      },
      {
        path: "sub-expertise-view-bid-manager",
        component: SubExpertiseViewBidManagerComponent
      },
      {
        path: "interested-supplier-wise-projects",
        component: InterestedSupplierWiseProjectsComponent
      }
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectManagerRoutingModule { }
