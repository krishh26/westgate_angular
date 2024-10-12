import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent {

  superdashboardlist: any = [];
  superstatictics: any = [];
  showLoader: boolean = false;
  chart: any = [];
  selectedDuration: string = 'daily'; // Default value
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getProjectDetails('daily');
    this.getSuperStatictics();
  }

  onDurationChange(duration: 'yearly' | 'monthly' | 'weekly' | 'daily') {
    this.selectedDuration = duration;  // Update the selectedDuration with the chosen value
    this.getProjectDetails(duration);  // Now call getProjectDetails with the updated duration
  }

  // Pass selectedDuration in the API call
  getProjectDetails(duration: 'yearly' | 'monthly' | 'weekly' | 'daily') {
    this.showLoader = true;
    this.superService.getDashboardList({ duration: this.selectedDuration }).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.superdashboardlist = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getSuperStatictics() {
    this.showLoader = true;
    this.superService.getsuperstatictics().subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          const responseData = response?.data;
          this.superstatictics = Object.keys(responseData).map((date) => {
            return {
              day: responseData[date].day,
              data: responseData[date].data
            };
          });
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


}
