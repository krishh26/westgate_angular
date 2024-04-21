import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-boss-user-live-project-listing',
  templateUrl: './boss-user-live-project-listing.component.html',
  styleUrls: ['./boss-user-live-project-listing.component.scss']
})
export class BossUserLiveProjectListingComponent {

  showLoader: boolean = false;
  projectList: any = [];

  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.getProjectList();
  }

  getProjectList() {
    this.showLoader = true;
    let params = {
      keyword: ''
    }
    this.projectService.getProjectList(params).subscribe((response) => {
      this.projectList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data;
       // this.totalRecords = response?.totalCount;
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
