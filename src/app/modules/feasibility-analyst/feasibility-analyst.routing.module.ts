import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeasibilityAnalystComponent } from './feasibility-analyst.component';
import { FeasibilityProjectDetailsComponent } from './feasibility-project-details/feasibility-project-details.component';
import { FeasibilityProjectsListComponent } from './feasibility-projects-list/feasibility-projects-list.component';
import { MinimumEligibilityFormComponent } from './minimum-eligibility-form/minimum-eligibility-form.component';
import { SummaryNoteQuestionsComponent } from './summary-note-questions/summary-note-questions.component';

const routes: Routes = [
    {
        path: '',
        component: FeasibilityAnalystComponent,
        children: [
            {
                path: "feasibility-project-detail",
                component: FeasibilityProjectDetailsComponent
            },
            {
                path: "feasibility-project-list",
                component: FeasibilityProjectsListComponent
            },
            {
                path: "minimum-eligibility-form",
                component: MinimumEligibilityFormComponent
            },
            {
                path: "summary-note-questions",
                component: SummaryNoteQuestionsComponent
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
export class FeasibilityAnalsystRoutingModule { }
