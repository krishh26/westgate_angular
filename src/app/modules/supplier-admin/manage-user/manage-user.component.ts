import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {

  showLoader: boolean = false;
  manageUserList: any = [];

  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getManageUserList();
  }

  getManageUserList() {
    this.showLoader = true;
    this.supplierService.getManageUserList().subscribe((response) => {
      this.manageUserList = [];
      this.totalRecords = 0;
      if (response?.status == true) {
        this.showLoader = false;
        this.manageUserList = response?.data?.data;
        this.totalRecords = response?.totalCount;
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
