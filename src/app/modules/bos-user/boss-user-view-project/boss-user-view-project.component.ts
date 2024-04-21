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

  getProjectDetails() {

    // let payload = {
    //   project_id: this.projectID
    // };
    this.showLoader = true;
    this.projectService.getProjectDetails().subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data[0];
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
