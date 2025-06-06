import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeasibilityAnalystComponent } from './feasibility-analyst.component';
import { FeasibilityProjectDetailsComponent } from './feasibility-project-details/feasibility-project-details.component';
import { FeasibilityProjectsListComponent } from './feasibility-projects-list/feasibility-projects-list.component';
import { MinimumEligibilityFormComponent } from './minimum-eligibility-form/minimum-eligibility-form.component';
import { SummaryNoteQuestionsComponent } from './summary-note-questions/summary-note-questions.component';
import { FeasibilityLoginDetailsComponent } from './feasibility-login-details/feasibility-login-details.component';
import { AddLoginDetailsComponent } from './add-login-details/add-login-details.component';
import { FeasibilityProfileComponent } from './feasibility-profile/feasibility-profile.component';
import { EditFeasibilityProjectDetailsComponent } from './edit-feasibility-project-details/edit-feasibility-project-details.component';
import { TodoTasksComponent } from '../bos-user/todo-tasks/todo-tasks.component';
import { FeasibilityProjectsToActionComponent } from './feasibility-projects-to-action/feasibility-projects-to-action.component';
import { FeasibilityProjectsCompletedComponent } from './feasibility-projects-completed/feasibility-projects-completed.component';
import { FeasibilityProjectsInProgressComponent } from './feasibility-projects-in-progress/feasibility-projects-in-progress.component';

const routes: Routes = [
  {
    path: '',
    component: FeasibilityAnalystComponent,
    children: [
      {
        path: 'feasibility-project-detail',
        component: FeasibilityProjectDetailsComponent,
      },
      {
        path: 'feasibility-project-list',
        component: FeasibilityProjectsListComponent,
      },
      {
        path: 'feasibility-projects-to-actions',
        component: FeasibilityProjectsToActionComponent,
      },
      {
        path: 'feasibility-projects-in-progress',
        component: FeasibilityProjectsInProgressComponent,
      },
      {
        path: 'feasibility-projects-completed',
        component: FeasibilityProjectsCompletedComponent,
      },
      {
        path: 'feasibility-todo-task',
        component: TodoTasksComponent,
      },
      {
        path: 'minimum-eligibility-form',
        component: MinimumEligibilityFormComponent,
      },
      {
        path: 'summary-note-questions',
        component: SummaryNoteQuestionsComponent,
      },
      {
        path: 'feasibility-login-detail',
        component: FeasibilityLoginDetailsComponent,
      },
      {
        path: 'add-login-detail',
        component: AddLoginDetailsComponent,
      },
      {
        path: 'profile',
        component: FeasibilityProfileComponent,
      },
      {
        path: 'edit-feasibility-project-details',
        component: EditFeasibilityProjectDetailsComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeasibilityAnalsystRoutingModule {}
