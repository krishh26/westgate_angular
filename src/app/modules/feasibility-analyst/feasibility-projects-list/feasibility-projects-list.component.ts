import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

@Component({
  selector: 'app-feasibility-projects-list',
  templateUrl: './feasibility-projects-list.component.html',
  styleUrls: ['./feasibility-projects-list.component.scss']
})
export class FeasibilityProjectsListComponent {

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
  categoryList: any = [];
  industryList: any = [];

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService
  ) { }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getcategoryList();
    this.getIndustryList();
    this.getProjectList();

  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }

  getcategoryList() {
    this.showLoader = true;
    this.superService.getCategoryList().subscribe((response) => {
      if (response?.message == "category fetched successfully") {
        this.showLoader = false;
        this.categoryList = response?.data;
      } else {
        // this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getIndustryList() {
    this.showLoader = true;
    this.superService.getIndustryList().subscribe((response) => {
      if (response?.message == "Industry fetched successfully") {
        this.showLoader = false;
        this.industryList = response?.data;
        console.log(this.industryList);
      } else {
        //  this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getProjectList() {
    this.showLoader = true;
    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
      this.projectList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data?.data;
        console.log(this.projectList);

        this.totalRecords = response?.data?.meta_data?.items;

        // this.projectList.forEach((project: any) => {
        //   const dueDate = new Date(project.dueDate);
        //   const currentDate = new Date();
        //   const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());

        //   const formattedDateDifference: string = this.formatMilliseconds(dateDifference);
        //   this.dateDifference = formattedDateDifference;
        // });
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
    Payload.projectList.keyword = this.searchText || '';
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    // let params = {
    //   keyword: this.searchText || '',
    //   page: String(this.page),
    //   limit: String(this.pagesize),
    // }
    console.log(Payload.projectList);
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
      this.projectList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data?.data;
        console.log(this.projectList);

        this.projectList.forEach((project: any) => {
          const dueDate = new Date(project.dueDate);
          const currentDate = new Date();
          const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());
          console.log(`Date difference for project ${dateDifference}`);
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
    this.router.navigate(['/feasibility-user/feasibility-project-detail'], { queryParams: { id: projectId } });
  }

  editProjectDetails(projectId: any) {
    this.router.navigate(['/boss-user/add-project'], { queryParams: { id: projectId } });
  }

  paginate(page: number) {
    this.page = page;
    this.getProjectList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editProject(projectId: string) {
    // Logic to handle editing the project
    console.log('Edit project with ID:', projectId);
    // You can navigate to an edit page or open a modal for editing
  }

  toggleEditMode(item: any) {
    item.isEditing = !item.isEditing;
    if (!item.isEditing) {
      // Optionally reset any changes here if needed
    }
  }

  saveProject(item: any) {
    // Logic to save the project changes
    console.log('Save project:', item);
    item.isEditing = false;
    // Optionally, implement actual save logic here (e.g., calling an API to save changes)
  }

}
