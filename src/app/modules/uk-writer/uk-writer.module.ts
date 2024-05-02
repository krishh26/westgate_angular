import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UkWriterComponent } from './uk-writer.component';
import { UkWriterRoutingModule } from './uk-writer.routing.module';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UkWriterHeaderComponent } from 'src/app/utility/shared/components/uk-writer-header/uk-writer-header.component';
import { UkWriterMatchedProjectsComponent } from './uk-writer-matched-projects/uk-writer-matched-projects.component';
import { UkWriterProjectsAllComponent } from './uk-writer-projects-all/uk-writer-projects-all.component';
import { UkWriterQuestionDetailsComponent } from './uk-writer-question-details/uk-writer-question-details.component';
import { UkWriterQuestionDetailsEditComponent } from './uk-writer-question-details-edit/uk-writer-question-details-edit.component';
import { UkWriterHomeComponent } from './uk-writer-home/uk-writer-home.component';

@NgModule({
  imports: [
    CommonModule,
    UkWriterRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [
    UkWriterComponent,
    UkWriterHeaderComponent,
    UkWriterMatchedProjectsComponent,
    UkWriterProjectsAllComponent,
    UkWriterQuestionDetailsComponent,
    UkWriterQuestionDetailsEditComponent,
    UkWriterHomeComponent,
    UkWriterMatchedProjectsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UkWriterModule { }
