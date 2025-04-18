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
  totalEmployees: number = 0;
  resourceSharingCount: number = 0;
  subcontractingCount: number = 0;
  totalActiveSuppliers: number = 0;
  totalInactiveSuppliers: number = 0;
  totalResourceSharingCount: number = 0;
  totalSubcontractingCount: number = 0;

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
    console.log('Toggle switch clicked, new state:', item.active);

    // When switching to inactive (false), open the comment modal
    if (item.active === false) {
      this.openCommentModal(item);
    } else {
      // When switching to active (true), update directly
      const payload = {
        active: true
      };

      console.log('Activating supplier with payload:', payload);

      this.authservice.updateUser(item._id, payload).subscribe(
        (response: any) => {
          console.log('Activation response:', response);
          if (response?.status) {
            this.notificationService.showSuccess(response?.message || 'Supplier activated successfully');
            this.getManageUserList();
          } else {
            this.notificationService.showError(response?.message || 'Failed to activate supplier');
            item.active = false; // Revert the toggle if there's an error
          }
        },
        (error: any) => {
          console.error('Error activating supplier:', error);
          this.notificationService.showError(error?.error?.message || 'Error activating supplier');
          item.active = false; // Revert the toggle if there's an error
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
    // Update search parameter handling
    if (this.search && this.search.trim()) {
      payload.search = this.search.trim();
    }

    this.superService.getSUpplierList(payload).subscribe(
      (response) => {
        this.supplierUserList = [];
        if (response?.status == true) {
          this.showLoader = false;
          this.supplierUserList = response?.data?.data;
          this.totalRecords = response?.data?.meta_data?.items || 0;

          // Calculate total employees from all suppliers
          this.totalEmployees = this.supplierUserList.reduce((sum: number, supplier: any) => {
            return sum + (supplier.employeeCount || 0);
          }, 0);

          // Get active and inactive suppliers count from response
          if (response?.data?.count) {
            // Store both current and total counts
            this.activeSuppliers = response?.data?.count?.active || 0;
            this.inactiveSuppliers = response?.data?.count?.inActive || 0;

            // Store the total counts for reference
            this.totalActiveSuppliers = response?.data?.count?.active || 0;
            this.totalInactiveSuppliers = response?.data?.count?.inActive || 0;

            // Get resource sharing and subcontracting counts if available in the API response
            if (response?.data?.count?.resourceSharing !== undefined) {
              this.resourceSharingCount = response?.data?.count?.resourceSharing || 0;
              this.totalResourceSharingCount = response?.data?.count?.resourceSharing || 0;
            } else {
              // Fallback to calculating from the data
              this.calculateResourceSharingCount();
              this.totalResourceSharingCount = this.resourceSharingCount;
            }

            if (response?.data?.count?.subContracting !== undefined) {
              this.subcontractingCount = response?.data?.count?.subContracting || 0;
              this.totalSubcontractingCount = response?.data?.count?.subContracting || 0;
            } else {
              // Fallback to calculating from the data
              this.calculateSubcontractingCount();
              this.totalSubcontractingCount = this.subcontractingCount;
            }
          } else {
            // Fallback to calculating from the current page data
            this.calculateSupplierCounts();
            this.calculateResourceSharingCount();
            this.calculateSubcontractingCount();

            // Store total counts
            this.totalActiveSuppliers = this.activeSuppliers;
            this.totalInactiveSuppliers = this.inactiveSuppliers;
            this.totalResourceSharingCount = this.resourceSharingCount;
            this.totalSubcontractingCount = this.subcontractingCount;
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

  // Single smart function to handle all filter types
  applyFilter(filterType: string) {
    // Create payload for filtering
    const payload: any = {
      page: "1", // Reset to first page when filtering
      limit: String(this.pagesize)
    };

    // Add filter parameter based on the type
    switch(filterType) {
      case 'resourceSharing':
        payload.resourceSharingSupplier = true;
        break;
      case 'subcontracting':
        payload.subcontractingSupplier = true;
        break;
      case 'active':
        payload.active = true;
        break;
      case 'inactive':
        payload.active = false;
        break;
      case 'clear':
        // Just reset filters without additional params
        this.search = '';
        this.startDate = '';
        this.endDate = '';
        break;
    }

    this.page = 1; // Reset page
    this.showLoader = true;

    this.superService.getSUpplierList(payload).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.supplierUserList = response?.data?.data;
          this.totalRecords = response?.data?.meta_data?.items || 0;

          // Calculate total employees for the filtered view
          this.calculateTotalEmployees();

          // Update only the relevant count for the filtered view, but display all total counts
          if (filterType === 'resourceSharing') {
            this.resourceSharingCount = this.supplierUserList.length;
          } else if (filterType === 'subcontracting') {
            this.subcontractingCount = this.supplierUserList.length;
          } else if (filterType === 'active') {
            this.activeSuppliers = this.supplierUserList.length;
          } else if (filterType === 'inactive') {
            this.inactiveSuppliers = this.supplierUserList.length;
          } else if (filterType === 'clear') {
            // Reset all counts to total counts
            if (response?.data?.count) {
              this.activeSuppliers = response?.data?.count?.active || 0;
              this.inactiveSuppliers = response?.data?.count?.inActive || 0;
              this.totalActiveSuppliers = this.activeSuppliers;
              this.totalInactiveSuppliers = this.inactiveSuppliers;

              // Update resource sharing and subcontracting counts if available
              if (response?.data?.count?.resourceSharing !== undefined) {
                this.resourceSharingCount = response?.data?.count?.resourceSharing || 0;
                this.totalResourceSharingCount = this.resourceSharingCount;
              } else {
                this.calculateResourceSharingCount();
                this.totalResourceSharingCount = this.resourceSharingCount;
              }

              if (response?.data?.count?.subContracting !== undefined) {
                this.subcontractingCount = response?.data?.count?.subContracting || 0;
                this.totalSubcontractingCount = this.subcontractingCount;
              } else {
                this.calculateSubcontractingCount();
                this.totalSubcontractingCount = this.subcontractingCount;
              }
            } else {
              this.calculateSupplierCounts();
              this.calculateResourceSharingCount();
              this.calculateSubcontractingCount();

              this.totalActiveSuppliers = this.activeSuppliers;
              this.totalInactiveSuppliers = this.inactiveSuppliers;
              this.totalResourceSharingCount = this.resourceSharingCount;
              this.totalSubcontractingCount = this.subcontractingCount;
            }
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

  // Helper method to calculate resource sharing count
  calculateResourceSharingCount() {
    if (this.supplierUserList && this.supplierUserList.length > 0) {
      this.resourceSharingCount = this.supplierUserList.filter((supplier: any) => supplier.resourceSharingSupplier === true).length;
    }
  }

  // Helper method to calculate subcontracting count
  calculateSubcontractingCount() {
    if (this.supplierUserList && this.supplierUserList.length > 0) {
      this.subcontractingCount = this.supplierUserList.filter((supplier: any) => supplier.subcontractingSupplier === true).length;
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
    console.log('Opening comment modal for supplier:', item);

    const modalRef = this.modalService.open(SuperadminCommentModalComponent, { centered: true });
    modalRef.componentInstance.supplier = item;
    modalRef.componentInstance.itemType = 'supplier';
    modalRef.componentInstance.sourceComponent = 'super-admin-supplier';

    modalRef.result.then(
      (result) => {
        console.log('Modal closed with result:', result);
        this.getManageUserList();
      },
      (reason) => {
        console.log('Modal dismissed:', reason);
        item.active = true; // Revert the toggle if modal was dismissed
      }
    );
  }

  // Calculate total employees from supplier list
  calculateTotalEmployees() {
    if (this.supplierUserList && this.supplierUserList.length > 0) {
      this.totalEmployees = this.supplierUserList.reduce((sum: number, supplier: any) => {
        return sum + (supplier.employeeCount || 0);
      }, 0);
    } else {
      this.totalEmployees = 0;
    }
  }

}
