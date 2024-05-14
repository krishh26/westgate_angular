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

const routes: Routes = [
  {
    path: "dashboard",
    component: ProjectManagerHomeComponent
  },
  {
    path: 'project',
    component: ProjectManagerComponent,
    children: [
      {
        path: "all",
        component: ProjectManagerAllProjectListComponent
      },
      {
        path: "match",
        component: ProjectManagerMatchProjectListComponent
      },
      {
        path: "close",
        component: ProjectManagerCloseProjectListComponent
      },
      {
        path: "details",
        component: AllProjectDetailsComponent
      },
      {
        path: "match-project-details",
        component: MatchProjectDetailsComponent
      },
      {
        path: "close-project-details",
        component: ProjectCloseDetailsComponent
      },
      {
        path: "summary-project-details",
        component: ProjectManagerSummaryDetailComponent
      },
    ]
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }
