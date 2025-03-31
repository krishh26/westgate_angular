import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { SuperadminCommentModalComponent } from '../superadmin-comment-modal/superadmin-comment-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CaseStudyBulkAddComponent } from '../case-study-bulk-add/case-study-bulk-add.component';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-super-admin-supplier',
  templateUrl: './super-admin-supplier.component.html',
  styleUrls: ['./super-admin-supplier.component.scss']
})
export class SuperAdminSupplierComponent {
  showExpertiseView: boolean = false;
  showLoader: boolean = false;
  supplierUserList: any = [];
  switchFlag: boolean = false;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  startDate: string = '';
  endDate: string = '';
  search: string = '';
  activeSuppliers: number = 0;
  inactiveSuppliers: number = 0;

  constructor(
    private supplierService: SupplierAdminService,
    private authservice: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal,
    private superService: SuperadminService
  ) { }

  ngOnInit(): void {
    this.getManageUserList();
  }

  toggleExpertiseView() {
    this.showExpertiseView = !this.showExpertiseView;
    if (this.showExpertiseView) {
      this.router.navigate(['/super-admin/expertise-view']);
    } else {
      this.router.navigate(['/super-admin/super-admin-supplier']);
    }
  }


  openAddTeamModal() {
    this.modalService.open(CaseStudyBulkAddComponent, { size: 'xl' });
  }

  deleteBulkProject() {

  }

  onToggleSwitch(item: any) {
    if (!item.active) {
      this.openCommentModal(item);
    } else {
      const payload = {
        active: true // Set the active field to true when the switch is turned on
      }
      this.authservice.updateUser(item._id, payload).subscribe(
        (response: any) => {
          if (response?.status) {
            this.notificationService.showSuccess(response?.message);
            this.getManageUserList();
            //   this.activeModal.close();
          }
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || 'Error');
        }
      );
    }
  }

  deleteSupplier(id: any) {
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
        this.supplierService.deleteSupplierUser(id).subscribe((response: any) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.notificationService.showSuccess('Supplier successfully deleted');
            this.getManageUserList();
          } else {
            this.showLoader = false;
            this.notificationService.showError(response?.message);
          }
        }, (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.message);
        });
      }
    });
  }

  searchtext() {
    this.page = 1;
    this.getManageUserList();
  }

  getManageUserList() {
    this.showLoader = true;

    // Create payload as a more flexible object
    const payload: any = {
      page: String(this.page),
      limit: String(this.pagesize)
    };

    // Add date filters if they exist
    if (this.startDate) {
      payload.startDate = this.startDate;
    }
    if (this.endDate) {
      payload.endDate = this.endDate;
    }
    if (this.search) {
      payload.searchText = this.search;
    }

    this.superService.getSUpplierList(payload).subscribe(
      (response) => {
        this.supplierUserList = [];
        if (response?.status == true) {
          this.showLoader = false;
          this.supplierUserList = response?.data?.data;
          this.totalRecords = response?.data?.meta_data?.items || 0;

          // Get active and inactive suppliers count from response
          if (response?.data?.count) {
            this.activeSuppliers = response?.data?.count?.active || 0;
            this.inactiveSuppliers = (response?.data?.count?.total || 0);
          } else {
            // Fallback to calculating from the current page data
            this.calculateSupplierCounts();
          }
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

  // Helper method to calculate supplier counts
  calculateSupplierCounts() {
    if (this.supplierUserList && this.supplierUserList.length > 0) {
      this.activeSuppliers = this.supplierUserList.filter((supplier: any) => supplier.active).length;
      this.inactiveSuppliers = this.supplierUserList.length - this.activeSuppliers;
    }
  }

  applyDateFilter() {
    this.page = 1;
    this.getManageUserList();
  }

  projectDetails(projectId: any, item: any) {
    let data = item;
    localStorage.setItem('supplierData', JSON.stringify(data))
    this.router.navigate(['/super-admin/supplier-user-profile'], { queryParams: { id: projectId } });
  }

  paginate(page: number) {
    this.page = page;
    this.getManageUserList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  openCommentModal(item: any) {
    const modalRef = this.modalService.open(SuperadminCommentModalComponent, { centered: true });
    modalRef.componentInstance.supplier = item;
    modalRef.result.then((comment) => {
      console.log('Comment received:', comment);
    }).catch((err) => {
      console.log('Modal dismissed');
    });
  }

}
