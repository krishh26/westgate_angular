import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
@Component({
  selector: 'app-supplier-user-activity',
  templateUrl: './supplier-user-activity.component.html',
  styleUrls: ['./supplier-user-activity.component.css']
})
export class SupplierUserActivityComponent {

  supplierActivityList: any = [];
  supplierID: string = '';
  supplierData: any = [];
  showLoader: boolean = false;
  supplierDetails: any = [];
  dates: string[] = []; // Will hold the keys (dates) dynamically
  rows: string[][] = []; // Will hold the rows of login times
  selectedStatus: string = '';
  status: string = '';
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  viewComments: any;

  statusList = [
    { name: 'Shortlisted' },
    { name: 'InSolution' },
    { name: 'WaitingForResult' },
    { name: 'Awarded' },
    { name: 'NotAwarded' }
  ];
  isExpired: boolean = true;
  projectList: any = [];
  dateDifference: any;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private projectService: ProjectService,
  ) { }

  ngOnInit() {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);

      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    // this.getSupplierdata();
    this.getSupplierActivity();
    this.getProjectList();
  }

  paginate(page: number) {
    this.page = page;
    this.getProjectList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  isDesc: boolean = false;
  column: string = 'publishDate';

  projectDetails(projectId: any) {
    this.router.navigate(['/super-admin/tracker-wise-project-details'], {
      queryParams: { id: projectId },
    });
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

  getProjectList(type?: string) {
    this.showLoader = true;

    Payload.projectListStatusWiseTracker.adminReview = '';
    Payload.projectListStatusWiseTracker.page = String(this.page);
    Payload.projectListStatusWiseTracker.limit = String(this.pagesize);
    Payload.projectListStatusWiseTracker.expired = this.isExpired;
    Payload.projectListStatusWiseTracker.bidManagerStatus = this.status || '';
    Payload.projectListStatusWiseTracker.supplierId = this.supplierID;

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

  getSupplierdata() {
    this.showLoader = true;
    this.supplierService.getSupplierDetails(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.supplierDetails = response.data;
          this.showLoader = false;
        } else {
          console.error('Failed to fetch supplier data:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
        this.showLoader = false;
      }
    );
  }

  getSupplierActivity() {
    this.showLoader = true;
    this.supplierService.getSupplierActivity(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.supplierDetails = response.data;

          // Extract dates (keys)
          this.dates = Object.keys(this.supplierDetails);

          // Find the maximum number of login times
          const maxEntries = Math.max(
            ...Object.values(this.supplierDetails).map((times) => (times as any[]).length)
          );

          // Prepare rows
          this.rows = Array.from({ length: maxEntries }, (_, rowIndex) =>
            this.dates.map((date) => this.supplierDetails[date][rowIndex]?.loginTime || "")
          );

          this.showLoader = false;
        } else {
          console.error('Failed to fetch supplier activity:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching supplier activity:', error);
        this.showLoader = false;
      }
    );
  }

  filterByStatus(status: any) {
    this.selectedStatus = status.name;
    this.status = status.name;  // Set the status that will be used in API call
    this.page = 1;  // Reset to first page when filter changes
    this.getProjectList();  // Call API with new status
  }

}
