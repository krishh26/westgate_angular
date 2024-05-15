import { Component } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SummaryService } from 'src/app/services/summary/summary.service';

@Component({
  selector: 'app-project-manager-summary-detail',
  templateUrl: './project-manager-summary-detail.component.html',
  styleUrls: ['./project-manager-summary-detail.component.scss']
})
export class ProjectManagerSummaryDetailComponent {

  summaryDetail:any
  reviewData:any
  showLoader: boolean = false;

  constructor(
    private summaryService: SummaryService,
    private notificationService: NotificationService,
  ){
    const details = localStorage.getItem('ViewSummary');
    console.log('details :', details);
    if(details) {
      this.summaryDetail = JSON.parse(details);
    }
  }
  saveSummaryResponse(){
    console.log('Review:', this.reviewData);
    let data= {type:'review', message: this.reviewData}
    this.summaryService.addSummaryReview(this.summaryDetail._id,data).subscribe((response) => {
      if (response?.status == true) {
        this.summaryDetail?.response.push(data)
        this.reviewData = ''
        this.showLoader = false;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }
}
