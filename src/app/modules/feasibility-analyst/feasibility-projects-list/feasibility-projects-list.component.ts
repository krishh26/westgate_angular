import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

interface Project {
  _id: string;
  projectName: string;
  description: string;
  category: string;
  industry: string;
  value: number;
  projectType: string;
  status: string;
  dueDate: Date;
  // Add other properties as needed
}

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
  statusList: any = [
    "InSolution3rdParty",
    "InSolution",
    "InReviewWestGate",
    "InReviewSHU",
    "InReview3rdParty",
    "InSubmission",
    "WaitingForResult",
    "Awarded",
    "NotAwarded",
    "Won"
  ];

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
    this.getCategoryList();
    this.getIndustryList();
    this.getProjectList();
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }

  getCategoryList() {
    this.showLoader = true;
    this.superService.getCategoryList().subscribe(
      (response) => {
        if (response?.status && response?.message === "category fetched successfully") {
          this.categoryList = response.data;
          this.showLoader = false;
        } else {
          console.error('Failed to fetch categories:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.showLoader = false;
      }
    );
  }

  getIndustryList() {
    this.showLoader = true;
    this.superService.getIndustryList().subscribe(
      (response) => {
        if (response?.status && response?.message === "Industry fetched successfully") {
          this.industryList = response.data;
          this.showLoader = false;
        } else {
          console.error('Failed to fetch industries:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching industries:', error);
        this.showLoader = false;
      }
    );
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
    console.log('Edit project with ID:', projectId);
  }

  toggleEditMode(item: any) {
    item.isEditing = !item.isEditing;
  }

  saveProject(item: Project) {
    const payload = {
      projectName: item.projectName,
      description: item.description,
      category: item.category,
      industry: item.industry,
      value: item.value,
      projectType: item.projectType,
      status: item.status,
      dueDate: item.dueDate
      // Add other fields as necessary
    };

    this.projectService.editProject(item._id, payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          // window.location.reload();
          this.getProjectList();
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
        }
      },
      (error) => {
        this.notificationService.showError('Failed to update project');
      }
    );
  }

  getCategoryName(categoryId: string): string {
    const foundCategory = this.categoryList.find((category: any) => category._id === categoryId);
    return foundCategory ? foundCategory.category : '';
  }

  getIndustryName(industryId: string): string {
    const foundIndustry = this.industryList.find((industry: any) => industry._id === industryId);
    return foundIndustry ? foundIndustry.industry : '';
  }

  // Number only validation
  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


}
