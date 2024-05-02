import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BidSubmissionComponent } from './bid-submission.component';
import { BidSubmissonHomeComponent } from './bid-submisson-home/bid-submisson-home.component';
import { BidQuestionDetailsUkComponent } from './bid-question-details-uk/bid-question-details-uk.component';
import { BidProjectsDetailsComponent } from './bid-projects-details/bid-projects-details.component';
import { BidProjectsAllComponent } from './bid-projects-all/bid-projects-all.component';
import { BidMatchedProjectsComponent } from './bid-matched-projects/bid-matched-projects.component';
import { BidQuestionDetailsComponent } from './bid-question-details/bid-question-details.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BidSubmissionComponent, BidSubmissonHomeComponent, BidQuestionDetailsUkComponent, BidProjectsDetailsComponent, BidProjectsAllComponent, BidMatchedProjectsComponent, BidQuestionDetailsComponent]
})
export class BidSubmissionModule { }
