import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import { BossUserBulkEntryComponent } from '../../bos-user/boss-user-bulk-entry/boss-user-bulk-entry.component';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-type-wise-project-details',
  templateUrl: './type-wise-project-details.component.html',
  styleUrls: ['./type-wise-project-details.component.scss']
})
export class TypeWiseProjectDetailsComponent {
 showLoader: boolean = false;
  projectList: any = [];
  categoryList: any = [];
  industryList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  searchText: any;
  myControl = new FormControl();
  minValue: number = 0;
  maxValue: number = 99999999999999999;
  options: Options = {
    floor: 0,
    ceil: 99999999999999999
  };
  loginUser: any;
  dateDifference: any;
  selectedCategories: any[] = [];
  selectedIndustries: any[] = [];
  selectedProjectTypes: any[] = [];
  selectedClientTypes: any[] = [];
  selectedStatuses: any[] = [];

  isExpired: boolean = false;

  projectTypeList = [
    { projectType: 'Development', value: 'Development' },
    { projectType: 'Product', value: 'Product' },
    { projectType: 'Service', value: 'Service' }
  ];

  clientTypeList = [
    { clientType: 'Public Sector', value: 'PublicSector' },
    { clientType: 'Private Sector', value: 'PrivateSector' }
  ];

  statusList = [
    { value: 'Awaiting', status: 'Awaiting' },
    { value: 'InProgress', status: 'In-Progress' },
    { value: 'InHold', status: 'In Hold' },
    { value: 'Passed', status: 'Pass' },
    { value: 'Fail', status: 'Fail' }
  ];

  publishStartDate: FormControl = new FormControl('');
  publishEndDate: FormControl = new FormControl('');
  submissionStartDate: FormControl = new FormControl('');
  submissionEndDate: FormControl = new FormControl('');

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private route: ActivatedRoute, private location: Location
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getcategoryList();
    this.getIndustryList();
    this.route.queryParams.subscribe(params => {
      const categorisation = params['categorisation'] || '';
      const projectType = params['projectType'] || ''; // Get projectType from query params

      console.log("Categorisation from Route Params: ", categorisation);
      console.log("Project Type from Route Params: ", projectType);

      // Pass both values to getProjectList
      this.getProjectList(categorisation, projectType);
    });
    this.publishEndDate.valueChanges.subscribe((res: any) => {
      if (!this.publishStartDate.value) {
        this.notificationService.showError('Please select a Publish start date');
        return
      } else {
        this.searchtext()
      }
    });
    this.submissionEndDate.valueChanges?.subscribe((res: any) => {
      if (!this.submissionStartDate.value) {
        this.notificationService.showError('Please select a Submission start date');
        return
      } else {
        this.searchtext()
      }
    });
     // Check if the reload has already happened
     if (!localStorage.getItem('pageReloade')) {
      localStorage.setItem('pageReloade', 'true'); // Set flag to prevent further reloads
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  goBack() {
    this.location.back();
  }


  onItemAddCategory(item: { category: string }): void {
    // Add type annotation for 'categoryItem'
    const found = this.categoryList.some((categoryItem: { category: string }) => categoryItem.category === item.category);
    if (!found) {
      this.showLoader = true;
      this.projectService.createCategory(item).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.getcategoryList();

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

  onItemAddIndustry(item: { industry: string }): void {
    // Add type annotation for 'categoryItem'
    console.log(this.industryList)

    const found = this.industryList.some((industryItem: { industry: string }) => industryItem.industry === item.industry);
    if (!found) {
      this.showLoader = true;
      this.projectService.createIndustry(item).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.getIndustryList();

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


  openAddTeamModal() {
    this.modalService.open(BossUserBulkEntryComponent, { size: 'xl' });
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
        this.notificationService.showError(response?.message);
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

      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getProjectList(categorisation: string | null = '', projectType: string | null = '') {
    this.showLoader = true;
    console.log(categorisation , 'categorisation');
    console.log(projectType , 'projectType');
    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    Payload.projectList.notRelatedDashboard = true;
    Payload.projectList.expired = true;

    // if (categorisation === 'Unknown Category') {
    //   categorisation = '';
    // }
    // if (projectType === 'Unknown ProjectType') {
    //   projectType = '';
    // }

    Payload.projectList.categorisation = categorisation === 'Unknown Category' ? '': categorisation?.trim() || '';
    Payload.projectList.projectType = projectType === 'Unknown ProjectType' ? '': projectType?.trim() || ''


    console.log("Final Payload:", Payload.projectList);

    if (categorisation) {
      this.projectService.getSearchByCategorisation(Payload.projectList).subscribe(
        (response) => this.handleApiResponse(response),
        (error) => this.handleApiError(error)
      );
    } else {
      this.projectService.getSearchByProduct(Payload.projectList).subscribe(
        (response) => this.handleApiResponse(response),
        (error) => this.handleApiError(error)
      );
    }
  }


  // Function to handle API response
  private handleApiResponse(response: any) {
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
  }

  // Function to handle API errors
  private handleApiError(error: any) {
    this.notificationService.showError(error?.message);
    this.showLoader = false;
  }

  searchtext() {
    this.showLoader = true;
    Payload.projectList.keyword = this.searchText;
    Payload.projectList.page = String(this.page);
    Payload.projectList.limit = String(this.pagesize);
    Payload.projectList.publishDateRange = (this.publishStartDate.value && this.publishEndDate.value) ? `${this.publishStartDate.value.year}-${this.publishStartDate.value.month}-${this.publishStartDate.value.day} , ${this.publishEndDate.value.year}-${this.publishEndDate.value.month}-${this.publishEndDate.value.day}` : '';
    Payload.projectList.SubmissionDueDateRange = (this.submissionStartDate.value && this.submissionEndDate.value) ? `${this.submissionStartDate.value.year}-${this.submissionStartDate.value.month}-${this.submissionStartDate.value.day} , ${this.submissionEndDate.value.year}-${this.submissionEndDate.value.month}-${this.submissionEndDate.value.day}` : '';
    Payload.projectList.valueRange = this.minValue + '-' + this.maxValue;
    Payload.projectList.expired = this.isExpired;
    Payload.projectList.notRelatedDashboard = true;
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
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
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
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
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };

  createddatesort(property: any) {
    this.isDesc = !this.isDesc;
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.projectList.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };

  duedatesort(property: any) {
    this.isDesc = !this.isDesc;
    this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.projectList.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };

  projectDetails(projectId: any) {
    this.router.navigate(['/process-manager/process-manager-project-details'], { queryParams: { id: projectId } });
  }

  paginate(event: number) {
    this.page = event;

    // Preserve filters when paginating
    this.route.queryParams.subscribe(params => {
      const categorisation = params['categorisation'] || '';
      const projectType = params['projectType'] || '';

      this.getProjectList(categorisation, projectType);
    });
  }


  sortListProject(projectId: string) {
    const payload = {
      userId: this.loginUser.id,
      projectId: projectId
    }
    this.projectService.projectSortList(payload).subscribe((response) => {
      if (response?.status) {
        this.notificationService.showSuccess(response?.message);
        this.getProjectList();
      } else {
        return this.notificationService.showError(response?.message);
      }
    }, (error) => {
      return this.notificationService.showError(error?.message || 'Something went wrong !');
    })
  }

  changeRange() {
    if (this.maxValue >= this.minValue) {
      this.searchtext();
    }
  }

}
