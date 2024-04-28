import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeasibilityProjectDetailsComponent } from './feasibility-project-details/feasibility-project-details.component';
import { FeasibilityAnalsystRoutingModule } from './feasibility-analyst.routing.module';
import { FeasibilityLoginDetailsComponent } from './feasibility-login-details/feasibility-login-details.component';
import { MinimumEligibilityFormComponent } from './minimum-eligibility-form/minimum-eligibility-form.component';
import { SummaryNoteQuestionsComponent } from './summary-note-questions/summary-note-questions.component';
import { AddLoginDetailsComponent } from './add-login-details/add-login-details.component';
import { FeasibilityProjectsListComponent } from './feasibility-projects-list/feasibility-projects-list.component';



@NgModule({
    declarations: [
        FeasibilityProjectDetailsComponent,
        FeasibilityLoginDetailsComponent,
        MinimumEligibilityFormComponent,
        SummaryNoteQuestionsComponent,
        AddLoginDetailsComponent,
        FeasibilityProjectsListComponent
    ],
    imports: [
        CommonModule,
        FeasibilityAnalsystRoutingModule,
        SharedModule,
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FeasibilityModule { }
