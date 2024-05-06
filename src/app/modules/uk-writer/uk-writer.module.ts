import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UkWriterComponent } from './uk-writer.component';
import { UkWriterHomeComponent } from './uk-writer-home/uk-writer-home.component';
import { UkWriterHeaderComponent } from 'src/app/utility/shared/components/uk-writer-header/uk-writer-header.component';
import { UkWriterMatchedProjectsComponent } from './uk-writer-matched-projects/uk-writer-matched-projects.component';
import { UkWriterProjectsAllComponent } from './uk-writer-projects-all/uk-writer-projects-all.component';
import { UkWriterProjectsDetailsComponent } from './uk-writer-projects-details/uk-writer-projects-details.component';
import { UkWriterQuestionDetailsEditComponent } from './uk-writer-question-details-edit/uk-writer-question-details-edit.component';



@NgModule({
  declarations: [
    UkWriterComponent,
    UkWriterHomeComponent,
    UkWriterHeaderComponent,
    UkWriterMatchedProjectsComponent,
    UkWriterProjectsAllComponent,
    UkWriterProjectsDetailsComponent,
    UkWriterQuestionDetailsEditComponent,
    UkWriterQuestionDetailsEditComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UkWriterModule { }
