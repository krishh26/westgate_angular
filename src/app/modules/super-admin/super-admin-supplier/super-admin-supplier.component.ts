import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-super-admin-supplier',
  templateUrl: './super-admin-supplier.component.html',
  styleUrls: ['./super-admin-supplier.component.scss']
})
export class SuperAdminSupplierComponent {

  showLoader: boolean = false;
  supplierUserList: any = [];

  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private supplierService: SupplierAdminService,
    private authservice: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getManageUserList();
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

  projectDetails(projectId: any, item: any) {
    let data = item;
    localStorage.setItem('supplierData', JSON.stringify(data))
    this.router.navigate(['/super-admin/super-admin-supplier-project-view'], { queryParams: { id: projectId } });
  }



}
