import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-manage-user-list',
  templateUrl: './supplier-manage-user-list.component.html',
  styleUrls: ['./supplier-manage-user-list.component.css']
})
export class SupplierManageUserListComponent {

  showLoader: boolean = false;
  manageUserList: any = [];
  supplierData: any = [];
  supplierID: string = '';
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);

      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getManageUserList();
  }

  getManageUserList() {
    this.showLoader = true;

    Payload.manageSUpplierUserList.page = String(this.page);
    Payload.manageSUpplierUserList.limit = String(this.pagesize);
    Payload.manageSUpplierUserList.userId = this.supplierID;

    this.supplierService.getsupplierManageUserList(Payload.manageSUpplierUserList).subscribe((response) => {
      this.manageUserList = [];
      this.totalRecords = response?.data?.meta_data?.items;
      if (response?.status == true) {
        this.showLoader = false;
        this.manageUserList = response?.data?.data;
        this.totalRecords = response?.totalCount;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.message);
      this.showLoader = false;
    });
  }

  deleteUser(id: any) {
    let params = {
      "id": id,
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.supplierService.deleteUser(params).subscribe((response: any) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.notificationService.showSuccess('User successfully deleted');
            this.getManageUserList();
          } else {
            this.showLoader = false;
            this.notificationService.showError(response?.message);
          }
        }, (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.error?.message || error?.message);
        });
      }
    });
  }


}
