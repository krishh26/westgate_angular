import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import { BossUserBulkEntryComponent } from '../boss-user-bulk-entry/boss-user-bulk-entry.component';

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
  dueDate: any;
  currentDate: Date = new Date();
  dateDifference: any;
  searchText: any;
  myControl = new FormControl();

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getProjectList();
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }

  getProjectList() {
    this.showLoader = true;
    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
      this.projectList = [];
      this.totalRecords = response?.data?.meta_data?.items;
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data?.data;
        console.log(this.projectList);

        this.projectList.forEach((project: any) => {
          const dueDate = new Date(project.dueDate);
          const currentDate = new Date();
          const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());
           
          const formattedDateDifference: string = this.formatMilliseconds(dateDifference);
          this.dateDifference = formattedDateDifference;
        });
        window.location.reload();
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  searchtext() {
    this.showLoader = true;
    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    console.log(Payload.projectList);
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
      this.projectList = [];
      this.totalRecords = response?.data?.meta_data?.items;
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data?.data;
        console.log(this.projectList);

        this.projectList.forEach((project: any) => {
          const dueDate = new Date(project.dueDate);
          const currentDate = new Date();
          const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());
           
          const formattedDateDifference: string = this.formatMilliseconds(dateDifference);
          this.dateDifference = formattedDateDifference;
        });
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }



  projectDetails(projectId: any) {
    this.router.navigate(['/boss-user/view-project'], { queryParams: { id: projectId } });
  }

  editProjectDetails(projectId: any) {
    this.router.navigate(['/boss-user/add-project'], { queryParams: { id: projectId } });
  }

  paginate(page: number) {
    this.page = page;
    this.getProjectList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openAddTeamModal() {
    this.modalService.open(BossUserBulkEntryComponent, { size : 'xl' });
  }

}

