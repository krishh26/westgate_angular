import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent {

  superdashboardlist: any = [];
  superstatictics: any = [];
  showLoader: boolean = false;

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSuperStatictics();
  }

  getProjectDetails() {
    this.showLoader = true;
    this.superService.getDashboardList().subscribe((response) => {
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
    this.superService.getsuperstatictics().subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.superstatictics = response?.data;
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
