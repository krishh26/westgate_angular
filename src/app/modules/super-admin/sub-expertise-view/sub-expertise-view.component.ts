import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sub-expertise-view',
  templateUrl: './sub-expertise-view.component.html',
  styleUrls: ['./sub-expertise-view.component.scss']
})
export class SubExpertiseViewComponent implements OnInit {
  expertiseName: string = '';
  expertiseId: string = '';
  subExpertiseList: any[] = [];
  totalRecords: number = pagination.totalRecords;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  showLoader: boolean = false;
  // Track which accordion items are collapsed
  collapsedState: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.expertiseName = params['expertiseName'];
      this.expertiseId = params['expertiseId'];

      // Always check for subExpertiseList first
      const subExpertiseListStr = params['subExpertiseList'];

      if (subExpertiseListStr) {
        try {
          // Use the data directly from query params
          this.subExpertiseList = JSON.parse(subExpertiseListStr);
          this.totalRecords = this.subExpertiseList.length;
          // Log success message
          console.log('Using data from query params. API call avoided.');
        } catch (error) {
          console.error('Error parsing subExpertiseList:', error);
          this.subExpertiseList = [];
          this.totalRecords = 0;
        }
      }
      // Only call API as a last resort when there's no subExpertiseList but we have an expertiseId
      else if (this.expertiseId) {
        console.log('No subExpertiseList data in params. Making API call with expertiseId:', this.expertiseId);
        this.loadExpertiseDetails();
      }
    });
  }

  loadExpertiseDetails() {
    this.spinner.show();

    // Use the existing service method with the appropriate ID parameter
    this.superService.getExpertiseList({ expertiseId: this.expertiseId }).subscribe(
      (response: any) => {
        this.spinner.hide();

        if (response?.status === true && response?.data) {
          // Find the expertise by ID in the response data array
          const expertise = response.data.find((item: any) => item._id === this.expertiseId);
          if (expertise) {
            this.subExpertiseList = expertise.subExpertiseList || [];
            this.totalRecords = this.subExpertiseList.length;
          } else {
            this.notificationService.showError('Expertise not found');
          }
        } else {
          this.notificationService.showError('Failed to load expertise details');
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.notificationService.showError('An error occurred while loading expertise details');
        console.error('Error loading expertise details:', error);
      }
    );
  }

  /**
   * Group files by supplier and generate a display-ready array
   * Returns an array of objects, each containing supplier information and associated files
   */
  groupFilesBySupplier(files: any[]): any[] {
    // If using the new data format with suppliers directly
    if (!files && this.getCurrentItem()?.suppliers) {
      return this.getCurrentItem().suppliers.map((supplier: any) => ({
        supplierId: supplier.supplierId || 'unknown',
        supplierName: supplier.supplierName || 'Unknown Supplier',
        files: supplier.files || []
      }));
    }

    // Handle empty or undefined files
    if (!files || !files.length) {
      return [];
    }

    // Sort files by supplier name first
    const sortedFiles = [...files].sort((a, b) => {
      const supplierA = a.supplierId?.name || 'Unknown';
      const supplierB = b.supplierId?.name || 'Unknown';
      return supplierA.localeCompare(supplierB);
    });

    // Group files by supplier ID
    const groupedFiles: any[] = [];
    let currentSupplierId: string | null = null;
    let currentSupplierName: string | null = null;
    let currentFiles: any[] = [];

    sortedFiles.forEach(file => {
      const supplierId = file.supplierId?._id || 'unknown';

      if (supplierId !== currentSupplierId) {
        // Save previous group if exists
        if (currentSupplierId && currentFiles.length) {
          groupedFiles.push({
            supplierId: currentSupplierId,
            supplierName: currentSupplierName || 'Unknown Supplier',
            files: currentFiles
          });
        }

        // Start new group
        currentSupplierId = supplierId;
        currentSupplierName = file.supplierId?.name || 'Unknown Supplier';
        currentFiles = [file];
      } else {
        // Add to existing group
        currentFiles.push(file);
      }
    });

    // Add the last group
    if (currentSupplierId && currentFiles.length) {
      groupedFiles.push({
        supplierId: currentSupplierId,
        supplierName: currentSupplierName || 'Unknown Supplier',
        files: currentFiles
      });
    }

    return groupedFiles;
  }

  // Helper method to get the current item from the subExpertiseList
  getCurrentItem(): any {
    if (!this.subExpertiseList || this.subExpertiseList.length === 0) {
      return null;
    }

    // Find the current item based on the open accordion
    for (const [index, isOpen] of Object.entries(this.collapsedState)) {
      if (isOpen && this.subExpertiseList[parseInt(index)]) {
        return this.subExpertiseList[parseInt(index)];
      }
    }

    return null;
  }

  // Get all suppliers for a sub-expertise item, even those with empty files arrays
  getSuppliers(item: any): any[] {
    if (!item) return [];

    // If using the new data format with suppliers array
    if (item.suppliers && Array.isArray(item.suppliers)) {
      return item.suppliers.map((supplier: any) => ({
        supplierId: supplier.supplierId || 'unknown',
        supplierName: supplier.supplierName || 'Unknown Supplier',
        files: supplier.files || []
      }));
    }

    // Fall back to the old format where suppliers are extracted from files
    return this.groupFilesBySupplier(item.files || []);
  }

  // Count the total number of suppliers for a sub-expertise item
  countSuppliers(item: any): number {
    if (item.suppliers && Array.isArray(item.suppliers)) {
      return item.suppliers.length;
    }

    return this.groupFilesBySupplier(item.files || []).length;
  }

  // Toggle the collapse state of an accordion item
  toggleCollapse(index: number): void {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  // Check if an accordion item is collapsed
  isCollapsed(index: number): boolean {
    return this.collapsedState[index] || false;
  }

  deleteDoc(fileId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this document?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.spinner.show();

        this.superService.deleteDocumentExpertise(fileId).subscribe(
          (response: any) => {
            this.spinner.hide();

            if (response?.status === true) {
              this.notificationService.showSuccess('Document successfully deleted');

              // Set a flag in localStorage to indicate data was modified
              localStorage.setItem('expertiseDataModified', 'true');

              // Always update in memory to avoid additional API calls
              this.updateSubExpertiseListAfterDelete(fileId);
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete document');
            }
          },
          (error: any) => {
            this.spinner.hide();
            this.notificationService.showError(error?.message || 'An error occurred while deleting the document');
            console.error('Error deleting document:', error);
          }
        );
      }
    });
  }

  // Helper method to update subExpertiseList after a file is deleted
  updateSubExpertiseListAfterDelete(fileId: string) {
    // Update subExpertiseList based on the structure
    this.subExpertiseList = this.subExpertiseList.map(item => {
      // If the item uses the new structure with suppliers
      if (item.suppliers && Array.isArray(item.suppliers)) {
        item.suppliers = item.suppliers.map((supplier: any) => {
          if (supplier.files && Array.isArray(supplier.files)) {
            supplier.files = supplier.files.filter((file: any) => file._id !== fileId);
          }
          return supplier;
        });
      }
      // If the item uses the old structure with files directly
      else if (item.files && Array.isArray(item.files)) {
        item.files = item.files.filter((file: any) => file._id !== fileId);
      }

      return item;
    });

    // Update total records
    this.totalRecords = this.subExpertiseList.length;
  }

  goBack() {
    const expertiseDataModified = localStorage.getItem('expertiseDataModified');

    // If data was modified, pass state information when navigating back
    if (expertiseDataModified === 'true') {
      localStorage.removeItem('expertiseDataModified');
      this.router.navigate(['/super-admin/expertise-view'], {
        state: { refreshData: true }
      });
    } else {
      this.router.navigate(['/super-admin/expertise-view']);
    }
  }

  // Count the total number of files for a sub-expertise item
  getFileCount(item: any): number {
    if (item.suppliers && Array.isArray(item.suppliers)) {
      return item.suppliers.reduce((count: number, supplier: any) => {
        return count + (supplier.files?.length || 0);
      }, 0);
    }

    return item.files?.length || 0;
  }
}
