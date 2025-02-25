import { Options } from '@angular-slider/ngx-slider/options';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import {
  createPayloadCopy,
  Payload,
} from 'src/app/utility/shared/constant/payload.const';

interface Project {
  _id: string;
  projectName: string;
  description: string;
  category: string;
  industry: string;
  minValue: number;
  maxValue: number;
  projectType: string;
  status: string;
  dueDate: Date;
  // Add other properties as needed
}

@Component({
  selector: 'app-project-manager-completed',
  templateUrl: './project-manager-completed.component.html',
  styleUrls: ['./project-manager-completed.component.scss']
})
export class ProjectManagerCompletedComponent {
  showLoader: boolean = false;
  projectList: any = [];
  isExpired: boolean = false;
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
  tempPayload: any;


  minValue: number = 0;
  maxValue: number = 99999999999999999;
  options: Options = {
    floor: 0,
    ceil: 99999999999999999,
  };
  loginUser: any = [];
  selectedCategories: any[] = [];
  selectedIndustries: any[] = [];
  selectedProjectTypes: any[] = [];
  selectedClientTypes: any[] = [];
  selectedStatuses: any[] = [];
  selectedBidStatuses:any[]= [];

  projectTypeList = [
    { projectType: 'Development', value: 'Development' },
    { projectType: 'Product', value: 'Product' },
    { projectType: 'Service', value: 'Service' },
  ];

  clientTypeList = [
    { clientType: 'Public Sector', value: 'PublicSector' },
    { clientType: 'Private Sector', value: 'PrivateSector' },
  ];

  statusList = [
    { value: 'Awaiting', status: 'Awaiting' },
    { value: 'InProgress', status: 'In-Progress' },
    { value: 'InHold', status: 'In Hold' },
    { value: 'Passed', status: 'Pass' },
    { value: 'Fail', status: 'Fail' },
    { value: 'DocumentsNotFound', status: 'Documents Not Found' }
  ];

  bidstatusList = [
    { bidvalue: 'Awaiting', bidstatus: 'Awaiting' },
    { bidvalue: 'InSolution', bidstatus: 'In Soulution' },
    { bidvalue: 'NotAwarded', bidstatus: 'Not Awarded' },
    { bidvalue: 'Awarded', bidstatus: 'Awarded' },
    { bidvalue: 'Dropped after feasibility', bidstatus: 'Dropped after feasibility' },
    { bidvalue: 'WaitingForResult', bidstatus: 'Waiting For Result' },
    { bidvalue: 'Nosuppliermatched', bidstatus: 'No Supplier Matched' }
  ]

  publishStartDate: FormControl = new FormControl('');
  publishEndDate: FormControl = new FormControl('');
  submissionStartDate: FormControl = new FormControl('');
  submissionEndDate: FormControl = new FormControl('');

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
      private localStorageService : LocalStorageService
  ) { 
    this.loginUser = this.localStorageService.getLogger();
   }

  ngOnInit(): void {
    this.tempPayload = createPayloadCopy();
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getCategoryList();
    this.getIndustryList();
    this.getProjectList();
    this.publishEndDate.valueChanges.subscribe((res: any) => {
      if (!this.publishStartDate.value) {
        this.notificationService.showError(
          'Please select a Publish start date'
        );
        return;
      } else {
        this.searchtext();
      }
    });
    this.submissionEndDate.valueChanges?.subscribe((res: any) => {
      if (!this.submissionStartDate.value) {
        this.notificationService.showError(
          'Please select a Submission start date'
        );
        return;
      } else {
        this.searchtext();
      }
    });
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    return `${days} days`;
  }

  getCategoryList() {
    this.showLoader = true;
    this.superService.getCategoryList().subscribe(
      (response) => {
        if (
          response?.status &&
          response?.message === 'category fetched successfully'
        ) {
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

  onItemAddCategory(item: { category: string }): void {
    // Add type annotation for 'categoryItem'
    const found = this.categoryList.some(
      (categoryItem: { category: string }) =>
        categoryItem.category === item.category
    );
    if (!found) {
      this.showLoader = true;
      this.projectService.createCategory(item).subscribe(
        (response) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.getCategoryList();
          } else {
            this.notificationService.showError(response?.message);
            this.showLoader = false;
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
        }
      );
    }
  }

  onItemAddIndustry(item: { industry: string }): void {
    // Add type annotation for 'categoryItem'
    console.log(this.industryList);

    const found = this.industryList.some(
      (industryItem: { industry: string }) =>
        industryItem.industry === item.industry
    );
    if (!found) {
      this.showLoader = true;
      this.projectService.createIndustry(item).subscribe(
        (response) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.getIndustryList();
          } else {
            this.notificationService.showError(response?.message);
            this.showLoader = false;
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
        }
      );
    }
  }

  getIndustryList() {
    this.showLoader = true;
    this.superService.getIndustryList().subscribe(
      (response) => {
        if (
          response?.status &&
          response?.message === 'Industry fetched successfully'
        ) {
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

  isDesc: boolean = false;
  column: string = 'publishDate';

  sort(property: any) {
    this.isDesc = !this.isDesc;
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.projectList.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }

  createddatesort(property: any) {
    this.isDesc = !this.isDesc;
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.projectList.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }

  duedatesort(property: any) {
    this.isDesc = !this.isDesc;
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.projectList.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      } else if (a[property] > b[property]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }

  getProjectList() {
    this.showLoader = true;
    this.tempPayload.projectList.keyword = this.searchText;
    this.tempPayload.projectList.page = String(this.page);
    this.tempPayload.projectList.limit = String(this.pagesize);
    this.tempPayload.projectList.appointed = this.loginUser?.id;
    this.tempPayload.projectList.bidManagerStatus =  "Dropped after feasibility, Awarded, NotAwarded, Nosuppliermatched, Not Releted";
    this.tempPayload.projectList.statusNotInclude = 'Fail';
    console.log(this.tempPayload.projectList);
    
    this.projectService.getProjectList(this.tempPayload.projectList).subscribe(
      (response) => {
        this.projectList = [];
        this.totalRecords = response?.data?.meta_data?.items;
        if (response?.status == true) {
          this.showLoader = false;
          this.projectList = response?.data?.data;

          this.totalRecords = response?.data?.meta_data?.items;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }

  searchtext() {
    this.showLoader = true;

    // Update payload with filters
    this.tempPayload.projectList.keyword = this.searchText;
    this.tempPayload.projectList.page = String(this.page);
    this.tempPayload.projectList.limit = String(this.pagesize);
    // this.tempPayload.projectList.category = this.selectedCategories.join(',');
    // this.tempPayload.projectList.industry = this.selectedIndustries.join(',');
    // this.tempPayload.projectList.projectType =
    //   this.selectedProjectTypes.join(',');
    // this.tempPayload.projectList.clientType =
    //   this.selectedClientTypes.join(',');
    this.tempPayload.projectList.status = this.selectedStatuses.join(',');
    this.tempPayload.projectList.bidManagerStatus = this.selectedBidStatuses?.length > 0 ? this.selectedBidStatuses.join(',') : 'Dropped after feasibility, Awarded, NotAwarded, Nosuppliermatched';
    this.tempPayload.projectList.publishDateRange =
      this.publishStartDate.value && this.publishEndDate.value
        ? `${this.publishStartDate.value.year}-${this.publishStartDate.value.month}-${this.publishStartDate.value.day} , ${this.publishEndDate.value.year}-${this.publishEndDate.value.month}-${this.publishEndDate.value.day}`
        : '';
    this.tempPayload.projectList.SubmissionDueDateRange =
      this.submissionStartDate.value && this.submissionEndDate.value
        ? `${this.submissionStartDate.value.year}-${this.submissionStartDate.value.month}-${this.submissionStartDate.value.day} , ${this.submissionEndDate.value.year}-${this.submissionEndDate.value.month}-${this.submissionEndDate.value.day}`
        : '';
    this.tempPayload.projectList.valueRange =
      this.minValue + '-' + this.maxValue;
    console.log(this.tempPayload.projectList);
    this.tempPayload.projectList.expired = this.isExpired;
    this.projectService.getProjectList(this.tempPayload.projectList).subscribe(
      (response) => {
        this.projectList = [];
        this.totalRecords = response?.data?.meta_data?.items;
        if (response?.status == true) {
          this.showLoader = false;
          this.projectList = response?.data?.data;

          this.projectList.forEach((project: any) => {
            const dueDate = new Date(project.dueDate);
            const currentDate = new Date();
            const dateDifference = Math.abs(
              dueDate.getTime() - currentDate.getTime()
            );

            const formattedDateDifference: string =
              this.formatMilliseconds(dateDifference);
            this.dateDifference = formattedDateDifference;
          });
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }

  projectDetails(projectId: any) {
    this.router.navigate(
      ['/project-manager/project/completed-project-details'],
      { queryParams: { id: projectId } }
    );
  }

  // editProjectDetails(projectId: any) {
  //   this.router.navigate(['/feasibility-user/edit-feasibility-project-details'], { queryParams: { id: projectId } });
  // }

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
      minValue: item.minValue,
      maxValue: item.maxValue,
      projectType: item.projectType,
      status: item.status,
      dueDate: item.dueDate,
      // Add other fields as necessary
    };
    this.projectService.editProject(item._id, payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          // window.location.reload();
          this.getProjectList();
        } else {
          this.notificationService.showError(
            response?.message || 'Failed to update project'
          );
        }
      },
      (error) => {
        this.notificationService.showError('Failed to update project');
      }
    );
  }

  getCategoryName(categoryId: string): string {
    const foundCategory = this.categoryList.find(
      (category: any) => category._id === categoryId
    );
    return foundCategory ? foundCategory.category : '';
  }

  getIndustryName(industryId: string): string {
    const foundIndustry = this.industryList.find(
      (industry: any) => industry._id === industryId
    );
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

  changeRange() {
    if (this.maxValue >= this.minValue) {
      this.searchtext();
    }
  }
}
