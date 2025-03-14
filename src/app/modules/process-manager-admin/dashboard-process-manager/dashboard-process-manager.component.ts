import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import Chart from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard-process-manager',
  templateUrl: './dashboard-process-manager.component.html',
  styleUrls: ['./dashboard-process-manager.component.scss']
})
export class DashboardProcessManagerComponent {
 trackerStartDate: FormControl = new FormControl('');
  trackerEndDate: FormControl = new FormControl('');
  superdashboardlist: any = [];
  superstatictics: any = [];
  supplierUserList: any = [];
  showLoader: boolean = false;
  chart: any = [];
  selectedDuration: string = 'daily'; // Default value
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  categoryWise: any = [];
  projectTypeWise: any = [];

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private authservice: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSuperStatictics();
    this.getManageUserList();
  }

  onCategoryClick(category: string | null) {
    let valueToPass = category && category !== "Unknown" ? category : null;

    console.log("valueToPass:", valueToPass);

    // Navigate and pass queryParams
    this.router.navigate(['/process-manager/type-wise-project-list'], {
      queryParams: { categorisation: valueToPass !== null ? valueToPass : '' },
      queryParamsHandling: 'merge' // Optional: Keeps existing query params
    });
  }

  export() {
    this.superService.exportProjects();
  }

  onSubmitDaterange() {
    const startDate = this.trackerStartDate.value;
    const endDate = this.trackerEndDate.value;

    if (!startDate || !endDate) {
      this.notificationService.showError("Please select both dates!");
      return;
    }

    console.log("Filtering data from", startDate, "to", endDate);
    this.getProjectDetails(true);
  }



  projectTypeClick(projectType: string | null) {
    let valueToPassProduct = projectType && projectType !== "Unknown" ? projectType : null;

    console.log("valueToPassProduct:", valueToPassProduct);

    // Navigate and pass queryParams
    this.router.navigate(['/process-manager/type-wise-project-list'], {
      queryParams: { projectType: valueToPassProduct !== null ? valueToPassProduct : '' },
      queryParamsHandling: 'merge' // Optional: Keeps existing query params
    });
  }


  onDurationChange(duration: 'yearly' | 'monthly' | 'weekly' | 'daily') {
    this.selectedDuration = duration;
    this.getProjectDetails();
  }

  onStartDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.trackerStartDate.setValue(input.value); // YYYY-MM-DD
    console.log('Selected Start Date:', input.value);
  }

  onEndDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.trackerEndDate.setValue(input.value); // YYYY-MM-DD
    console.log('Selected End Date:', input.value);
  }

  private formatDate(date: string): string {
    if (!date) return '';
    const dateParts = date.split('-'); // Splitting YYYY-MM-DD
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to DD-MM-YYYY
  }

  getProjectDetails(dateFilter?: boolean) {
    this.showLoader = true;
    console.log("this.trackerStartDate", this.trackerStartDate, this.trackerStartDate.value);
    const payload: any = {};


    if (dateFilter) {
      const startCreatedDate = this.trackerStartDate.value || ''; // Already in YYYY-MM-DD format
      const endCreatedDate = this.trackerEndDate.value || ''; // Already in YYYY-MM-DD format

      payload['startDate'] = startCreatedDate;
      payload['endDate'] = endCreatedDate;
    }

    this.superService.getDashboardList(payload).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;

          // Store the dashboard list data
          this.superdashboardlist = response?.data;

          // Convert categorisationWise object to an array of {name, totalProjects}
          this.categoryWise = Object.keys(response?.data?.categorisationWise || {}).map(key => {
            return { name: key, totalProjects: response.data.categorisationWise[key] };
          });

          // Convert projectTypeWise object to an array of {name, totalProjects}
          this.projectTypeWise = Object.keys(response?.data?.projectTypeWise || {}).map(key => ({
            name: key.trim() ? key : 'Unknown', // Replace empty key with 'Unknown'
            totalProjects: response.data.projectTypeWise[key],
          }));

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


  getSuperStatictics() {
    this.showLoader = true;
    this.superService.getsuperstatictics().subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          const responseData = response?.data;

          // Convert categoryWise object to an array of {name, totalProjects}
          this.categoryWise = Object.keys(responseData.categoryWise).map(key => {
            return { name: key, totalProjects: responseData.categoryWise[key] };
          });

          // Set up chart data if necessary (this part was unchanged)
          const day = this.superstatictics.map((project: any) => project?.day);
          const data = this.superstatictics.map((project: any) => project?.data);
          this.chart = new Chart('canvas', {
            type: 'bar',
            data: {
              labels: day,
              datasets: [
                {
                  label: '# Data',
                  data: data,
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
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


  getManageUserList() {
    this.showLoader = true;
    this.authservice.getUserList('SupplierAdmin').subscribe(
      (response) => {
        this.supplierUserList = [];
        this.totalRecords = response?.data?.meta_data?.items;
        if (response?.status == true) {
          this.showLoader = false;
          this.supplierUserList = response?.data;
          this.totalRecords = response?.totalCount;
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

  paginate(page: number) {
    this.page = page;
    this.getManageUserList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


}
