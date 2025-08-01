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
import { NgxSpinnerService } from 'ngx-spinner';

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
  pagesize: number = 50;
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
  isDeletedFilter: boolean = false;
  totalDeletedCount: number = 0;
  isInHoldFilter: boolean = false;
  totalInHoldCount: number = 0;
  totalSupplierEmployeeCount: number = 0;
  // Store original counts for restoring after filtering
  originalCounts: any = {
    active: 0,
    inactive: 0,
    resourceSharing: 0,
    subcontracting: 0,
    deleted: 0,
    inHold: 0
  };
  currentFilter: string = '';

  constructor(
    private supplierService: SupplierAdminService,
    private authservice: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal,
    private superService: SuperadminService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    // Apply active filter by default when page loads
    this.applyFilter('active');
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
    // When switching to inactive (false), open the comment modal
    if (item.active === false) {
      this.openCommentModal(item);
    } else {
      this.emailConfirmationForActiveSupplier(item);
    }
  }


  emailConfirmationForActiveSupplier(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to send mail to supplier ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
    }).then((result: any) => {
      let payload = {};
      // When switching to active (true), update directly
      console.log("result?.value", result?.value);
      if (result?.value) {
        payload = {
          active: true,
          isSendMail: true
        };
      } else {
        payload = {
          active: true,
          isSendMail: false
        };
      }
      this.spinner.show();
      this.authservice.updateUser(item._id, payload).subscribe(
        (response: any) => {
          if (response?.status) {
            this.notificationService.showSuccess(response?.message || 'Supplier activated successfully');
            // Maintain the current filter instead of resetting it
            if (this.currentFilter && this.currentFilter !== 'clear') {
              this.applyFilter(this.currentFilter);
            } else {
              this.getManageUserList();
            }
          } else {
            this.notificationService.showError(response?.message || 'Failed to activate supplier');
            item.active = false; // Revert the toggle if there's an error
          }
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.hide();
          this.notificationService.showError(error?.error?.message || 'Error activating supplier');
          item.active = false; // Revert the toggle if there's an error
        }
      );
    });
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
            // Maintain the current filter after deletion
            if (this.currentFilter && this.currentFilter !== 'clear') {
              this.applyFilter(this.currentFilter);
            } else {
              this.getManageUserList();
            }
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

  searchtext() {
    this.page = 1;
    // Maintain the current filter when searching
    if (this.currentFilter && this.currentFilter !== 'clear') {
      this.applyFilter(this.currentFilter);
    } else {
      this.getManageUserList();
    }
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

    // Add isDeleted parameter if checkbox is checked
    if (this.isDeletedFilter) {
      payload.isDeleted = true;
    }

    // Add inHold parameter if checkbox is checked
    if (this.isInHoldFilter) {
      payload.inHold = true;
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

          // Get counts from response.data.count object
          if (response?.data?.count) {
            // Store active and inactive counts
            this.activeSuppliers = response?.data?.count?.active || 0;
            this.inactiveSuppliers = response?.data?.count?.inActive || 0;

            // Store total counts
            this.totalActiveSuppliers = this.activeSuppliers;
            this.totalInactiveSuppliers = this.inactiveSuppliers;

            // Use resourceSharingCount and subcontractingCount directly from response
            this.resourceSharingCount = response?.data?.count?.resourceSharingCount || 0;
            this.totalResourceSharingCount = this.resourceSharingCount;

            this.subcontractingCount = response?.data?.count?.subcontractingCount || 0;
            this.totalSubcontractingCount = this.subcontractingCount;

            // Get inHold count from response
            this.totalInHoldCount = response?.data?.count?.inHoldCount || 0;

            // Get deleted count from response
            this.totalDeletedCount = response?.data?.count?.isDeletedCount || 0;

            // If there's a total in the response
            if (response?.data?.count?.total !== undefined) {
              this.totalRecords = response?.data?.count?.total || 0;
            }

            // Store original counts for reference when filtering
            this.originalCounts = {
              active: this.totalActiveSuppliers,
              inactive: this.totalInactiveSuppliers,
              resourceSharing: this.totalResourceSharingCount,
              subcontracting: this.totalSubcontractingCount,
              deleted: this.totalDeletedCount,
              inHold: this.totalInHoldCount
            };

            // Store total supplier employee count
            this.totalSupplierEmployeeCount = response?.data?.count?.totalSupplierEmployeeCount || 0;
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

            // Store original counts
            this.originalCounts = {
              active: this.totalActiveSuppliers,
              inactive: this.totalInactiveSuppliers,
              resourceSharing: this.totalResourceSharingCount,
              subcontracting: this.totalSubcontractingCount,
              deleted: this.totalDeletedCount,
              inHold: this.totalInHoldCount
            };

            // Store total supplier employee count
            this.totalSupplierEmployeeCount = this.totalEmployees;
          }
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
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

    // Add date filters if they exist
    if (this.startDate) {
      payload.startDate = this.startDate;
    }
    if (this.endDate) {
      payload.endDate = this.endDate;
    }

    // Reset filter flags - when applying a new filter, reset all flags first
    this.isDeletedFilter = false;
    this.isInHoldFilter = false;

    // Set the current filter for reference
    this.currentFilter = filterType;

    // Apply specific filter based on type
    switch (filterType) {
      case 'active':
        // 'status' is the parameter name expected by the API for active status
        payload.active = true;
        break;
      case 'inactive':
        // 'status' is the parameter name expected by the API for inactive status
        payload.active = false;
        payload.inHold = false;
        break;
      case 'resourceSharing':
        // Match the property name expected by the service (resourceSharing)
        payload.resourceSharingSupplier = true;
        break;
      case 'subcontracting':
        // Match the property name expected by the service (subContracting)
        payload.subcontractingSupplier = true;
        break;
      case 'isDeleted':
        payload.isDeleted = true;
        this.isDeletedFilter = true;
        break;
      case 'inHold':
        payload.inHold = true;
        this.isInHoldFilter = true;
        break;
      case 'clear':
        // No additional filters - reset to default view
        this.currentFilter = '';
        break;
    }

    // First, get the count for pagination
    if (filterType !== 'clear') {
      this.getFilteredCount(filterType, { ...payload, countOnly: true });
    }

    // Reset page and get filtered list
    this.page = 1;
    // Update search query if present
    if (this.search && this.search.trim()) {
      payload.search = this.search.trim();
    }

    this.showLoader = true;
    console.log('Applying filter:', filterType, 'with payload:', payload);

    this.superService.getSUpplierList(payload).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.supplierUserList = response?.data?.data;

          // Always update all badge counts from the API response, regardless of filter
          if (response?.data?.count) {
            // Update all counts from the response
            this.totalActiveSuppliers = response?.data?.count?.active || 0;
            this.totalInactiveSuppliers = response?.data?.count?.inActive || 0;
            this.totalResourceSharingCount = response?.data?.count?.resourceSharingCount || 0;
            this.totalSubcontractingCount = response?.data?.count?.subcontractingCount || 0;
            this.totalInHoldCount = response?.data?.count?.inHoldCount || 0;
            this.totalDeletedCount = response?.data?.count?.isDeletedCount || 0;
            this.totalSupplierEmployeeCount = response?.data?.count?.totalSupplierEmployeeCount || 0;

            // Store the original counts
            this.originalCounts = {
              active: this.totalActiveSuppliers,
              inactive: this.totalInactiveSuppliers,
              resourceSharing: this.totalResourceSharingCount,
              subcontracting: this.totalSubcontractingCount,
              deleted: this.totalDeletedCount,
              inHold: this.totalInHoldCount
            };
          }

          // Only calculate filtered counts for the current view
          if (filterType !== 'clear') {
            this.calculateFilteredCounts();
          } else {
            // If clearing filters, get the full list
            this.getManageUserList();
          }
        } else {
          this.showLoader = false;
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(error?.error?.message || error?.message);
      }
    );
  }

  // Get filter count for accurate pagination
  getFilteredCount(filterType: string, payload: any) {
    this.superService.getSUpplierList(payload).subscribe(
      (response) => {
        if (response?.status == true) {
          // Update totalRecords based on the filtered count
          if (response?.data?.meta_data?.totalCount) {
            this.totalRecords = response?.data?.meta_data?.totalCount;
          } else if (response?.data?.meta_data?.filteredCount) {
            this.totalRecords = response?.data?.meta_data?.filteredCount;
          } else if (response?.data?.meta_data?.items) {
            this.totalRecords = response?.data?.meta_data?.items;
          } else if (response?.data?.count) {
            // Use the specific count based on filter type
            switch (filterType) {
              case 'active':
                this.totalRecords = response?.data?.count?.active || 0;
                break;
              case 'inactive':
                this.totalRecords = response?.data?.count?.inActive || 0;
                break;
              case 'resourceSharing':
                this.totalRecords = response?.data?.count?.resourceSharingCount || 0;
                break;
              case 'subcontracting':
                this.totalRecords = response?.data?.count?.subcontractingCount || 0;
                break;
              case 'isDeleted':
                this.totalRecords = response?.data?.count?.isDeletedCount || 0;
                break;
              case 'inHold':
                this.totalRecords = response?.data?.count?.inHoldCount || 0;
                break;
            }
          }

          // Always update all badge counts from the API response
          if (response?.data?.count) {
            this.totalActiveSuppliers = response?.data?.count?.active || 0;
            this.totalInactiveSuppliers = response?.data?.count?.inActive || 0;
            this.totalResourceSharingCount = response?.data?.count?.resourceSharingCount || 0;
            this.totalSubcontractingCount = response?.data?.count?.subcontractingCount || 0;
            this.totalInHoldCount = response?.data?.count?.inHoldCount || 0;
            this.totalDeletedCount = response?.data?.count?.isDeletedCount || 0;
            this.totalSupplierEmployeeCount = response?.data?.count?.totalSupplierEmployeeCount || 0;
          }
        }
      }
    );
  }

  // Calculate counts for the filtered data
  calculateFilteredCounts() {
    if (this.supplierUserList && this.supplierUserList.length > 0) {
      // Only calculate for the current filtered view, don't update total badge counts
      this.activeSuppliers = this.supplierUserList.filter((supplier: any) => supplier.active).length;
      this.inactiveSuppliers = this.supplierUserList.filter((supplier: any) => !supplier.active).length;
      this.resourceSharingCount = this.supplierUserList.filter((supplier: any) => supplier.resourceSharingSupplier === true).length;
      this.subcontractingCount = this.supplierUserList.filter((supplier: any) => supplier.subcontractingSupplier === true).length;
      this.calculateTotalEmployees();
    }
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
    // Maintain the current filter when applying date filter
    if (this.currentFilter && this.currentFilter !== 'clear') {
      this.applyFilter(this.currentFilter);
    } else {
      this.getManageUserList();
    }
  }

  projectDetails(projectId: any, item: any) {
    let data = item;
    localStorage.setItem('supplierData', JSON.stringify(data))
    this.router.navigate(['/super-admin/supplier-user-profile'], { queryParams: { id: projectId } });
  }

  paginate(page: number) {
    this.page = page;

    // Check if there's an active filter and use that instead of regular getManageUserList
    if (this.currentFilter && this.currentFilter !== 'clear') {
      // Create a payload object similar to applyFilter method
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

      // Add search query if present
      if (this.search && this.search.trim()) {
        payload.search = this.search.trim();
      }

      // Reset filter flags before setting the appropriate one
      this.isDeletedFilter = false;
      this.isInHoldFilter = false;

      // Apply specific filter based on current filter type
      switch (this.currentFilter) {
        case 'active':
          payload.active = true;
          break;
        case 'inactive':
          payload.active = false;
          break;
        case 'resourceSharing':
          payload.resourceSharingSupplier = true;
          break;
        case 'subcontracting':
          payload.subcontractingSupplier = true;
          break;
        case 'isDeleted':
          payload.isDeleted = true;
          this.isDeletedFilter = true;
          break;
        case 'inHold':
          payload.inHold = true;
          this.isInHoldFilter = true;
          break;
      }

      this.showLoader = true;
      console.log('Paginating with filter:', this.currentFilter, 'with payload:', payload);

      this.superService.getSUpplierList(payload).subscribe(
        (response) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.supplierUserList = response?.data?.data;

            // Update counts for the current filtered view
            this.calculateFilteredCounts();
          } else {
            this.showLoader = false;
            this.notificationService.showError(response?.message);
          }
        },
        (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.error?.message || error?.message);
        }
      );
    } else {
      // If no filter, use regular getManageUserList
      this.getManageUserList();
    }

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
        // Maintain the current filter instead of resetting it
        if (this.currentFilter && this.currentFilter !== 'clear') {
          this.applyFilter(this.currentFilter);
        } else {
          this.getManageUserList();
        }
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

  // Handler for the inHold checkbox (deprecated but kept for reference)
  toggleInHoldFilter() {
    this.applyFilter('inHold');
  }

  // Add a helper method to check if any supplier has inHold=true
  hasAnyInHoldSupplier(): boolean {
    if (!this.supplierUserList || this.supplierUserList.length === 0) {
      return false;
    }
    return this.supplierUserList.some((supplier: any) => supplier.isInHold === true);
  }

  // Add a helper method to get inHold comment
  getFirstInHoldComment(commentArray: any[]): string {
    if (!commentArray || commentArray.length === 0) {
      return '-';
    }

    const firstComment = commentArray[0];

    // Handle different possible structures of the comment
    if (typeof firstComment === 'string') {
      return firstComment;
    } else if (typeof firstComment === 'object') {
      // Check various possible properties that might contain the comment text
      return firstComment.comment || firstComment.text || firstComment.message ||
        firstComment.content || JSON.stringify(firstComment);
    }

    return '-';
  }

  // Helper to check if a comment is long (over 100 chars)
  isCommentLong(comment: string, length: number = 100): boolean {
    return typeof comment === 'string' && comment.length > length;
  }

  // Toggle view more/view less for a supplier's inHoldComment
  toggleInHoldComment(item: any) {
    item.showFullInHoldComment = !item.showFullInHoldComment;
  }

}
