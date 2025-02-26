import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeasibilityManagerComponent } from './feasibility-manager.component';
import { FeasibilityManagerProjectsCompletedComponent } from './feasibility-manager-projects-completed/feasibility-manager-projects-completed.component';
import { FeasibilityManagerProjectsInProgressComponent } from './feasibility-manager-projects-in-progress/feasibility-manager-projects-in-progress.component';
import { FeasibilityManagerProjectsToActionComponent } from './feasibility-manager-projects-to-action/feasibility-manager-projects-to-action.component';
import { FeasibilityManagerReviewComponent } from './feasibility-manager-review/feasibility-manager-review.component';
import { TodoTasksComponent } from '../bos-user/todo-tasks/todo-tasks.component';
import { FeasibilityManagerAwaitingSectionComponent } from './feasibility-manager-awaiting-section/feasibility-manager-awaiting-section.component';
import { FeasibilityManagerProjectDetailsComponent } from './feasibility-manager-project-details/feasibility-manager-project-details.component';

const routes: Routes = [
    {
        path: '',
        component: FeasibilityManagerComponent,
        children: [
            {
                path: 'feasibility-manager-projects-to-actions',
                component: FeasibilityManagerProjectsToActionComponent,
            },
            {
                path: 'feasibility-manager-projects-in-progress',
                component: FeasibilityManagerProjectsInProgressComponent,
            },
            {
                path: 'feasibility-manager-projects-completed',
                component: FeasibilityManagerProjectsCompletedComponent,
            },
            {
                path: 'feasibility-manager-awaiting-section',
                component: FeasibilityManagerAwaitingSectionComponent,
            },
            {
                path: 'feasibility-manager-review',
                component: FeasibilityManagerReviewComponent,
            },
            {
                path: 'feasibility-manager-todo-task',
                component: TodoTasksComponent,
            },
            {
                path: 'feasibility-manager-project-details',
                component: FeasibilityManagerProjectDetailsComponent,
            },
        ]
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
export class FeasibilityManagerRoutingModule { }
