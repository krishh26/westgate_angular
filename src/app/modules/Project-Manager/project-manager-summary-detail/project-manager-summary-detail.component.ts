import { Component } from '@angular/core';

@Component({
  selector: 'app-project-manager-summary-detail',
  templateUrl: './project-manager-summary-detail.component.html',
  styleUrls: ['./project-manager-summary-detail.component.scss']
})
export class ProjectManagerSummaryDetailComponent {

  summaryDetail:any

  constructor(){
    const details = localStorage.getItem('ViewSummary');
    if(details) {
      this.summaryDetail = JSON.parse(details);
    }
  }
}
