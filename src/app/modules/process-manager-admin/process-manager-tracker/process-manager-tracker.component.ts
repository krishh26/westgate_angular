import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import { BossUserBulkEntryComponent } from '../../bos-user/boss-user-bulk-entry/boss-user-bulk-entry.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-process-manager-tracker',
  templateUrl: './process-manager-tracker.component.html',
  styleUrls: ['./process-manager-tracker.component.scss'],
})
export class ProcessManagerTrackerComponent {
  showLoader: boolean = false;
  selectedStatus: string | null = null;
  selectedBidStatus: string | null = null;
  statusWiseData: { status: string; count: number; value: number }[] = [];
  projectStatuses: string[] = [];
  // Declare the properties
  feasibilityData: { status: string; count: number; value: number }[] = [];
  bidData: { status: string; count: number; value: number }[] = [];
  trackerStartDate: FormControl = new FormControl('');
  trackerEndDate: FormControl = new FormControl('');
  projectList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: any;
  dateDifference: any;
  status: string = '';
  filterObject: { [key: string]: string } = {
    Awaiting: 'Awaiting',
    DocumentsNotFound: 'DocumentsNotFound',
    Fail: 'Fail',
    InProgress: 'InProgress',
    InHold: 'InHold',
    Passed: 'Passed',
    'Dropped after feasibility': 'Dropped after feasibility',
    InSolution: 'InSolution',
    Shortlisted: 'Shortlisted',
    WaitingForResult: 'WaitingForResult',
    Awarded: 'Awarded',
    NotAwarded: 'NotAwarded',
    ToAction: 'ToAction',
    Nosuppliermatched: 'Nosuppliermatched',
    'Go-NoGoStage1': 'Go-NoGoStage1',
    SupplierConfirmation: 'SupplierConfirmation',
    'Go-NoGoStage2': 'Go-NoGoStage2',
    "Not Releted": 'Not Releted'
  };
  selectedCategories: any[] = [];
  selectedIndustries: any[] = [];
  selectedProjectTypes: any[] = [];
  selectedClientTypes: any[] = [];
  selectedStatuses: any[] = [];

  minValue: number = 0;
  maxValue: number = 99999999999999999;
  options: Options = {
    floor: 0,
    ceil: 99999999999999999,
  };
  isExpired: boolean = false;
  categorisationChecked: boolean = false;
  categorisation: string = '';
  selectedCategorisation: string[] = [];

  publishStartDate: FormControl = new FormControl('');
  publishEndDate: FormControl = new FormControl('');
  submissionStartDate: FormControl = new FormControl('');
  submissionEndDate: FormControl = new FormControl('');
  viewComments: any;
  myControl = new FormControl();

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private projectService: ProjectService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getDataByStatus();
    this.getProjectList();
  }

  updateCategorisation(value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // Add value if checked
      this.selectedCategorisation.push(value);
    } else {
      // Remove value if unchecked
      this.selectedCategorisation = this.selectedCategorisation.filter(
        (item) => item !== value
      );
    }

    this.searchtext(); // Call search function on change
    this.getDataByStatus();
  }

  openAddTeamModal() {
    this.modalService.open(BossUserBulkEntryComponent, { size: 'xl' });
  }

  searchtext() {
    this.showLoader = true;
    // console.log('this is called', this.searchText);

    // Update payload with filters
    Payload.projectListStatusWiseTracker.keyword = this.searchText;
    Payload.projectListStatusWiseTracker.page = String(this.page);
    Payload.projectListStatusWiseTracker.limit = String(this.pagesize);
    Payload.projectListStatusWiseTracker.category =
      this.selectedCategories.join(',');
    Payload.projectListStatusWiseTracker.industry =
      this.selectedIndustries.join(',');
    Payload.projectListStatusWiseTracker.projectType =
      this.selectedProjectTypes.join(',');
    Payload.projectListStatusWiseTracker.clientType =
      this.selectedClientTypes.join(',');
    Payload.projectListStatusWiseTracker.status = this.status;
    Payload.projectListStatusWiseTracker.publishDateRange =
      this.publishStartDate.value && this.publishEndDate.value
        ? `${this.publishStartDate.value.year}-${this.publishStartDate.value.month}-${this.publishStartDate.value.day} , ${this.publishEndDate.value.year}-${this.publishEndDate.value.month}-${this.publishEndDate.value.day}`
        : '';
    Payload.projectListStatusWiseTracker.SubmissionDueDateRange =
      this.submissionStartDate.value && this.submissionEndDate.value
        ? `${this.submissionStartDate.value.year}-${this.submissionStartDate.value.month}-${this.submissionStartDate.value.day} , ${this.submissionEndDate.value.year}-${this.submissionEndDate.value.month}-${this.submissionEndDate.value.day}`
        : '';
    Payload.projectListStatusWiseTracker.valueRange =
      this.minValue + '-' + this.maxValue;

    // Include new checkbox values as a comma-separated string
    Payload.projectListStatusWiseTracker.expired = this.isExpired;
    Payload.projectListStatusWiseTracker.categorisation =
      this.selectedCategorisation.join(',');

    this.projectService
      .getProjectList(Payload.projectListStatusWiseTracker)
      .subscribe(
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
  selectStatus(status: string): void {
    this.selectedBidStatus = '';
    this.selectedStatus = status;
  }

  selectBidStatus(status: string): void {
    this.selectedStatus = '';
    Payload.projectListStatusWiseTracker.sortlist = false;
    this.selectedBidStatus = status;
  }

  getDataByStatus() {
    this.showLoader = true;

    // Format the start and end dates before using them in the payload
    const startDate = this.trackerStartDate.value
      ? this.formatDate(this.trackerStartDate.value)
      : '';
    const endDate = this.trackerEndDate.value
      ? this.formatDate(this.trackerEndDate.value)
      : '';

    // Prepare the request payload with expired and categorisation filters
    const payload = {
      startDate,
      endDate,
      expired: this.isExpired, // Pass expired value
      categorisation: this.selectedCategorisation.join(','), // Pass selected categorisation as a comma-separated string
    };

    // Call the service to fetch data
    this.supplierService.getDataBYStatus(payload).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status) {
          const {
            FeasibilityStatusCount,
            FeasibilityStatusValue,
            BidStatusCount,
            BidStatusValue,
          } = response.data;

          // Combine Feasibility data
          this.feasibilityData = Object.keys(FeasibilityStatusCount).map(
            (status) => ({
              status,
              count: FeasibilityStatusCount[status] || 0,
              value: FeasibilityStatusValue[status] || 0,
            })
          );

          // Combine Bid data
          this.bidData = Object.keys(BidStatusCount).map((status) => ({
            status,
            count: BidStatusCount[status] || 0,
            value: BidStatusValue[status] || 0,
          }));
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(error?.message);
      }
    );

    this.getProjectList();
  }


  private formatDate(date: any): string {
    if (!date) return '';

    let formattedDate;
    if (date instanceof Date) {
      // If date is a Date object
      formattedDate = date.toISOString().split('T')[0]; // Extracts yyyy-MM-dd
    } else if (typeof date === 'string') {
      // If date is already in a string format
      formattedDate = date;
    } else if (typeof date === 'object' && date.year && date.month && date.day) {
      // If date is an object { year, month, day }
      formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      formattedDate = '';
    }

    return formattedDate;
  }

  isDesc: boolean = false;
  column: string = 'publishDate';

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

  projectDetails(projectId: any) {
    this.router.navigate(['/process-manager/process-manager-project-details'], {
      queryParams: { id: projectId },
    });
  }


  paginate(page: number) {
    this.page = page;
    this.getProjectList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getProjectList(type?: string) {
    this.showLoader = true;

    const startCreatedDate = this.trackerStartDate.value
      ? this.formatDate(this.trackerStartDate.value)
      : '';
    const endCreatedDate = this.trackerEndDate.value
      ? this.formatDate(this.trackerEndDate.value)
      : '';
    Payload.projectListStatusWiseTracker.adminReview = '';
    Payload.projectListStatusWiseTracker.keyword = this.searchText;
    Payload.projectListStatusWiseTracker.page = String(this.page);
    Payload.projectListStatusWiseTracker.limit = String(this.pagesize);
    Payload.projectListStatusWiseTracker.expired = this.isExpired;
    Payload.projectListStatusWiseTracker.startCreatedDate = startCreatedDate;
    Payload.projectListStatusWiseTracker.endCreatedDate = endCreatedDate;
    if (type === 'feasibility') {
      Payload.projectListStatusWiseTracker.status = this.status || '';
      Payload.projectListStatusWiseTracker.bidManagerStatus = '';
    } else if (type === 'bid') {
      Payload.projectListStatusWiseTracker.bidManagerStatus = this.status || '';
      Payload.projectListStatusWiseTracker.status = 'Passed';
    }

    this.projectService
      .getProjectList(Payload.projectListStatusWiseTracker)
      .subscribe(
        (response) => {
          this.projectList = [];
          this.totalRecords = response?.data?.meta_data?.items;

          if (response?.status === true) {
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

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }

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

  filter(value: any, type: string) {
    console.log('this is values', value, this.filterObject[value], type);

    // Check if the status is "Shortlisted"
    if (value === 'Shortlisted') {
      // Set shortlisted to true
      Payload.projectListStatusWiseTracker.sortlist = true;
      this.status = '';
      // Clear other relevant parameters
      Payload.projectListStatusWiseTracker.status = '';
      Payload.projectListStatusWiseTracker.bidManagerStatus = '';
      // Payload.projectListStatusWiseTracker.bidManagerStatus = '';
    } else {
      // Use the existing filter logic for other statuses
      this.status = this.filterObject[value];
      Payload.projectListStatusWiseTracker.sortlist = false; // Clear shortlisted if not shortlisted
    }

    // Call the method to get the project list with the updated parameters
    this.getProjectList(type);
  }

  showComments(data: any) {
    console.log('this is my view comment', data);
    this.viewComments = data;
  }

  // Method to check if there are any pinned comments
  hasPinnedComments(): boolean {
    if (!this.viewComments || this.viewComments.length === 0) {
      return false;
    }
    return this.viewComments.some((comment: any) => comment?.pinnedAt);
  }

  // Method to format the display of status labels
  getFormattedStatus(status: string): string {
    return status === 'Not Releted' ? 'Not Related' : status;
  }
}
