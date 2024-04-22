import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-boss-user-view-project',
  templateUrl: './boss-user-view-project.component.html',
  styleUrls: ['./boss-user-view-project.component.scss']
})
export class BossUserViewProjectComponent {
  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    this.projectID = localStorage.getItem("projectID");
  }

  ngOnInit(): void {
    this.getProjectDetails();
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }

  getProjectDetails() {
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
