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

      if (this.expertiseId) {
        this.loadExpertiseDetails();
      } else {
        const subExpertiseListStr = params['subExpertiseList'];
        if (subExpertiseListStr) {
          this.subExpertiseList = JSON.parse(subExpertiseListStr);
          this.totalRecords = this.subExpertiseList.length;
        }
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

              // Reload the expertise details
              if (this.expertiseId) {
                this.loadExpertiseDetails();
              } else {
                // If we don't have an expertiseId, reload the page
                window.location.reload();
              }
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

  goBack() {
    this.router.navigate(['/super-admin/expertise-view']);
  }
}
