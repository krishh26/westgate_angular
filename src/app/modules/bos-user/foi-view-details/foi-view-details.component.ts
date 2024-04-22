import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoiService } from 'src/app/services/foi-service/foi.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-foi-view-details',
  templateUrl: './foi-view-details.component.html',
  styleUrls: ['./foi-view-details.component.scss']
})
export class FoiViewDetailsComponent {

  foiDetails: any = [];
  foiId: string = '';
  foiID: any;
  showLoader: boolean = false;
  projectDetails: any = [];
  dateDifference: any;

  constructor(
    private foiService: FoiService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.foiId = params['id']
    });
    this.foiID = localStorage.getItem("foiID");
  }

  ngOnInit(): void {
    this.getFOIDetails();
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }

  getFOIDetails() {
    // let payload = {
    //   project_id: this.projectID
    // };
    this.showLoader = true;
    this.projectService.getProjectDetails().subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data[0];
        const dueDate = new Date(this.projectDetails?.dueDate);
        const currentDate = new Date();
        const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());
        console.log(`Date difference for project ${dateDifference}`);
        const formattedDateDifference: string = this.formatMilliseconds(dateDifference);
        this.dateDifference = formattedDateDifference;
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
