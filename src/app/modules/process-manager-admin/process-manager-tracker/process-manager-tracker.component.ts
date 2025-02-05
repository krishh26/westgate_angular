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
  styleUrls: ['./process-manager-tracker.component.scss']
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
    DroppedAfterFeasibility: 'DroppedAfterFeasibility',
    InSolution: 'InSolution',
    Shortlisted: 'Shortlisted',
    WaitingForResult: 'WaitingForResult',
    Awarded: 'Awarded',
    NotAwarded: 'NotAwarded',
    ToAction: 'ToAction'
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
    ceil: 99999999999999999
  };
  isExpired: boolean = false;
  categorisationChecked: boolean = false;
  categorisation: string = '';
  selectedCategorisation: string[] = [];

  publishStartDate: FormControl = new FormControl('');
  publishEndDate: FormControl = new FormControl('');
  submissionStartDate: FormControl = new FormControl('');
  submissionEndDate: FormControl = new FormControl('');

  myControl = new FormControl();

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private projectService: ProjectService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getDataByStatus();
    this.trackerEndDate.valueChanges.subscribe((res: any) => {
      if (!this.trackerStartDate.value) {
        this.notificationService.showError(
          'Please select a Publish start date'
        );
        return;
      } else {
        this.getDataByStatus();
      }
    });
    this.getProjectList();
  }

  updateCategorisation(value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // Add value if checked
      this.selectedCategorisation.push(value);
    } else {
      // Remove value if unchecked
      this.selectedCategorisation = this.selectedCategorisation.filter(item => item !== value);
    }

    this.searchtext(); // Call search function on change
  }

  openAddTeamModal() {
    this.modalService.open(BossUserBulkEntryComponent, { size: 'xl' });
  }

  searchtext() {
    this.showLoader = true;
    console.log('this is called', this.searchText);

    // Update payload with filters
    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    Payload.projectList.category = this.selectedCategories.join(',');
    Payload.projectList.industry = this.selectedIndustries.join(',');
    Payload.projectList.projectType = this.selectedProjectTypes.join(',');
    Payload.projectList.clientType = this.selectedClientTypes.join(',');
    Payload.projectList.status = this.selectedStatuses.join(',');
    Payload.projectList.publishDateRange =
      (this.publishStartDate.value && this.publishEndDate.value)
        ? `${this.publishStartDate.value.year}-${this.publishStartDate.value.month}-${this.publishStartDate.value.day} , ${this.publishEndDate.value.year}-${this.publishEndDate.value.month}-${this.publishEndDate.value.day}`
        : '';
    Payload.projectList.SubmissionDueDateRange =
      (this.submissionStartDate.value && this.submissionEndDate.value)
        ? `${this.submissionStartDate.value.year}-${this.submissionStartDate.value.month}-${this.submissionStartDate.value.day} , ${this.submissionEndDate.value.year}-${this.submissionEndDate.value.month}-${this.submissionEndDate.value.day}`
        : '';
    Payload.projectList.valueRange = this.minValue + '-' + this.maxValue;

    // Include new checkbox values as a comma-separated string
    Payload.projectList.expired = this.isExpired;
    Payload.projectList.categorisation = this.selectedCategorisation.join(',');

    this.projectService.getProjectList(Payload.projectList).subscribe(
      (response) => {
        this.projectList = [];
        this.totalRecords = response?.data?.meta_data?.items;
        if (response?.status == true) {
          this.showLoader = false;
          this.projectList = response?.data?.data;

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
    this.selectedBidStatus = status;
  }

  getDataByStatus() {
    this.showLoader = true;

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
      expired: this.isExpired,  // Pass expired value
      categorisation: this.selectedCategorisation.join(',') // Pass selected categorisation as a comma-separated string
    };

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
          console.error('Failed to fetch data:', response?.message);
        }
      },
      (error) => {
        this.showLoader = false;
        console.error('Error fetching data:', error);
      }
    );

    this.getProjectList();
  }


  private formatDate(date: {
    year: number;
    month: number;
    day: number;
  }): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
      date.day
    ).padStart(2, '0')}`;
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
    this.router.navigate(['/process-manager/process-manager-project-details'], { queryParams: { id: projectId } });
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

    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    Payload.projectList.expired = this.isExpired;
    Payload.projectList.startCreatedDate = startCreatedDate;
    Payload.projectList.endCreatedDate = endCreatedDate;

    if (type === 'feasibility') {
      Payload.projectList.status = this.status || '';
      Payload.projectList.bidManagerStatus = '';
    } else if (type === 'bid') {
      Payload.projectList.bidManagerStatus = this.status || '';
      Payload.projectList.status = 'Passed';
    }

    this.projectService.getProjectList(Payload.projectList).subscribe(
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
      Payload.projectList.sortlist = true;
      // Clear other relevant parameters
      Payload.projectList.status = '';
      // Payload.projectList.bidManagerStatus = '';
    } else {
      // Use the existing filter logic for other statuses
      this.status = this.filterObject[value];
      Payload.projectList.sortlist = false; // Clear shortlisted if not shortlisted
    }

    // Call the method to get the project list with the updated parameters
    this.getProjectList(type);
  }
}
