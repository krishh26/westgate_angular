import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boss-user-supplier-user-profile',
  templateUrl: './boss-user-supplier-user-profile.component.html',
  styleUrls: ['./boss-user-supplier-user-profile.component.scss']
})
export class BossUserSupplierUserProfileComponent {
  activeTab: string = 'profile';
  supplierData: any = [];
  supplierID: string = '';
  showLoader: boolean = false;
  supplierDetails: any = [];
  manageUserList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  inHoldCommentForm!: FormGroup;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private httpClient: HttpClient
  ) {
    this.inHoldCommentForm = new FormGroup({
      comment: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // Check if the hideOtherTabs flag is set in localStorage
    if (localStorage.getItem('hideOtherTabs') === 'true') {
      // Redirect to the Historical Data tab if the flag is set
      this.router.navigate(['/boss-user/admin-case-study-list']);
      return;
    }

    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);

      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getSupplierdata();
    this.getManageUserList();
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

  deleteSupplier(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this supplier?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.supplierService.deleteSupplierUser(id).subscribe((response: any) => {
          if (response?.status) {
            this.showLoader = false;
            this.notificationService.showSuccess('Supplier successfully deleted');
            this.router.navigate(['/boss-user/supplier']);
          } else {
            this.showLoader = false;
            this.notificationService.showError(response?.message);
          }
        }, (error: any) => {
          this.showLoader = false;
          this.notificationService.showError(error?.error?.message || error?.message);
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/boss-user/supplier']);
  }

  submitInHoldComment() {
    if (this.inHoldCommentForm.invalid) {
      this.notificationService.showError('Please enter a comment');
      return;
    }

    this.showLoader = true;
    const comment = this.inHoldCommentForm.get('comment')?.value;

    const payload = {
      inHoldComment: comment
    };

    this.httpClient.patch(`${environment.baseUrl}/user/update/${this.supplierID}`, payload)
      .subscribe(
        (response: any) => {
          this.showLoader = false;
          if (response?.status) {
            this.notificationService.showSuccess('Comment added successfully');
            this.inHoldCommentForm.reset();
            this.getSupplierdata();
          } else {
            this.notificationService.showError(response?.message || 'Failed to add comment');
          }
        },
        (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.message || 'Error adding comment');
        }
      );
  }
}
