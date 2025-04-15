import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sub-expertise-list',
  templateUrl: './sub-expertise-list.component.html',
  styleUrls: ['./sub-expertise-list.component.scss']
})
export class SubExpertiseListComponent implements OnInit {

  expertiseName: string = '';
  supplierId: string = '';
  subExpertiseList: any[] = [];
  subExpertiseDropdownList: any[] = [];
  searchResults: any[] = [];
  totalRecords: number = pagination.totalRecords;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  selectedFiles: File[] = [];
  supplierID: string = '';
  viewDocs: any;
  showLoader: boolean = false;
  files: any = []
  newSubExpertise: string = '';
  subExpertiseTags: string[] = [];
  showAddButton: boolean = true;
  isFromExpertiseView: boolean = false;
  collapsedItems: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    // Check if coming from expertise-view
    if (this.router.getCurrentNavigation()?.extras?.state) {
      const navigationState = this.router.getCurrentNavigation()?.extras?.state;
      if (navigationState && navigationState['from'] === 'expertise-view') {
        this.showAddButton = false;
        this.isFromExpertiseView = true;
      }
    }

    // Check if URL contains expertise-view
    const previousUrl = this.router.url;
    if (previousUrl.includes('/super-admin/expertise-view')) {
      this.showAddButton = false;
      this.isFromExpertiseView = true;
    }

    this.route.queryParams.subscribe(params => {
      // Get expertise name and supplierId from query params
      this.expertiseName = params['expertiseName'];
      this.supplierId = params['supplierId'];

      // Also set supplierID to use in other methods
      if (this.supplierId) {
        this.supplierID = this.supplierId;
      }

      // Check for source parameter
      if (params['source'] === 'expertise-view') {
        this.showAddButton = false;
        this.isFromExpertiseView = true;
      }

      console.log('Loading sub-expertise list for:', {
        expertiseName: this.expertiseName,
        supplierId: this.supplierId,
        isFromExpertiseView: this.isFromExpertiseView
      });

      // Fetch sub-expertise data
      this.getSubExpertise();
      this.getSubExpertiseList();
    });
  }

  onFilesSelected(event: any, expertise: string) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    this.selectedFiles = Array.from(event.target.files);

    const invalidFiles = this.selectedFiles.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Only PDF or Word files (.pdf, .doc, .docx) are allowed.');
      this.selectedFiles = [];
      return;
    }

    if (this.selectedFiles.length > 0) {
      this.uploadFiles(expertise);
    }
  }

  uploadFiles(expertise: string) {
    if (!this.selectedFiles.length) {
      this.notificationService.showError('Please select files to upload.');
      return;
    }

    // Check if we have a supplier ID
    if (!this.supplierId && !this.supplierID) {
      this.notificationService.showError('Supplier ID is missing, cannot upload files.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('expertise', this.expertiseName);
    formData.append('subExpertise', expertise);
    formData.append('supplierId', this.supplierId || this.supplierID);
    this.spinner.show();
    this.superService.uploadByTag(formData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.spinner.hide();
          this.notificationService.showSuccess('Files uploaded successfully!');
          // Refresh the file list after upload
          this.getSubExpertise();
          // Refresh the document list for this specific sub-expertise
          this.viewUploadedDocuments(expertise);
          // Clear selected files
          this.selectedFiles = [];
          window.location.reload();
        } else {
          this.spinner.hide();
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.message);
      }
    );
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
        this.showLoader = true;
        this.spinner.show();

        this.superService.deleteDocumentExpertise(fileId).subscribe(
          (response: any) => {
            this.spinner.hide();
            this.showLoader = false;
            if (response?.status === true) {
              this.notificationService.showSuccess('Document successfully deleted');

              // Find the deleted document to get its sub-expertise
              const deletedDoc = this.files.find((file: any) => file._id === fileId);
              const subExpertiseName = deletedDoc?.subExpertise;

              // Refresh the file list
              this.getSubExpertise();
              window.location.reload();
              // If we have the sub-expertise name, refresh that specific document list
              if (subExpertiseName) {
                this.viewUploadedDocuments(subExpertiseName);
              }
            } else {
              this.notificationService.showError(response?.message);
            }
          },
          (error) => {
            this.spinner.hide();
            this.showLoader = false;
            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }

  viewUploadedDocuments(subExpertise: string) {
    console.log('Viewing documents for:', subExpertise);

    // Filter files by subExpertise
    this.viewDocs = this.files?.filter((file: any) => file?.subExpertise === subExpertise);

    if (!this.viewDocs || this.viewDocs.length === 0) {
      this.notificationService.showInfo(`No files available for ${subExpertise}`);
      this.viewDocs = [];
    }
  }

  getSubExpertise() {
    if (!this.expertiseName) {
      console.error('Expertise name is missing');
      return;
    }

    if (this.isFromExpertiseView) {
      // For expertise-view path, we need to get all expertises and then filter
      this.superService.getExpertiseList().subscribe(
        (response) => {
          if (response?.status) {
            // Find all expertise entries with the matching name
            const matchingExpertises = response?.data?.filter((item: any) => item.name === this.expertiseName);

            if (matchingExpertises && matchingExpertises.length > 0) {
              // Collect all unique subExpertise values
              const allSubExpertises = new Set<string>();

              matchingExpertises.forEach((expertise: any) => {
                if (expertise.subExpertise && Array.isArray(expertise.subExpertise)) {
                  expertise.subExpertise.forEach((sub: string) => allSubExpertises.add(sub));
                }
              });

              this.subExpertiseList = Array.from(allSubExpertises);
              this.totalRecords = this.subExpertiseList.length;
            } else {
              console.error(`Expertise with name "${this.expertiseName}" not found`);
              this.subExpertiseList = [];
            }
          } else {
            console.error('Error fetching expertise data:', response?.message);
            this.subExpertiseList = [];
          }
        },
        (error) => {
          console.error('Error fetching sub-expertise:', error);
          this.subExpertiseList = [];
        }
      );
    } else {
      // For other paths, we filter by supplier ID
      if (!this.supplierId) {
        console.error('Supplier ID is missing');
        return;
      }

      this.supplierService.getSupplierDetails(this.supplierId).subscribe(
        (response) => {
          if (response?.status) {
            // Find all expertise entries with the matching name for this supplier
            const matchingExpertises = response?.data?.expertise?.filter((item: any) =>
              item.name === this.expertiseName
            );

            if (matchingExpertises && matchingExpertises.length > 0) {
              // Collect all unique subExpertise values
              const allSubExpertises = new Set<string>();

              matchingExpertises.forEach((expertise: any) => {
                if (expertise.subExpertise && Array.isArray(expertise.subExpertise)) {
                  expertise.subExpertise.forEach((sub: string) => allSubExpertises.add(sub));
                }
              });

              this.subExpertiseList = Array.from(allSubExpertises);
              this.totalRecords = this.subExpertiseList.length;
              this.files = response?.files || [];
            } else {
              console.error(`Expertise with name "${this.expertiseName}" not found for supplier ID ${this.supplierId}`);
              this.subExpertiseList = [];
            }
          } else {
            console.error('Error fetching supplier data:', response?.message);
            this.subExpertiseList = [];
          }
        },
        (error) => {
          console.error('Error fetching sub-expertise:', error);
          this.subExpertiseList = [];
        }
      );
    }
  }

  saveSubExpertise() {
    if (!this.subExpertiseTags || this.subExpertiseTags.length === 0) {
      this.notificationService.showError('Please select at least one sub expertise');
      return;
    }

    // Check if we have a supplier ID
    if (!this.supplierId && !this.supplierID) {
      this.notificationService.showError('Supplier ID is missing, cannot save sub-expertise.');
      return;
    }

    // Prepare data for sub-expertise based on requested format
    const subExpertiseData = {
      supplierId: this.supplierId || this.supplierID,
      expertise: this.expertiseName,
      subExpertise: this.subExpertiseTags
    };

    this.superService.addSubExpertise(subExpertiseData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Sub expertise added successfully!');
          this.subExpertiseTags = []; // Reset the selected sub-expertises

          // Close the modal
          const modalElement = document.getElementById('addSubExpertiseModal');
          if (modalElement) {
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }

          // Reload the page
          window.location.reload();
        } else {
          this.notificationService.showError(response?.message || 'Failed to add sub expertise');
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.message || 'Failed to add sub expertise');
      }
    );
  }

  // Updated function to store search results
  getSubExpertiseList(searchText?: string) {
    this.spinner.show();
    this.superService.getSubExpertiseDropdownList(searchText).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response?.status) {
          this.subExpertiseDropdownList = response?.data || [];
          console.log('Sub-expertise dropdown list loaded:', this.subExpertiseDropdownList);
        } else {
          console.error('Error fetching sub-expertise dropdown list:', response?.message);
          this.subExpertiseDropdownList = [];
        }
      },
      (error: any) => {
        this.spinner.hide();
        console.error('Error fetching sub-expertise dropdown list:', error);
        this.subExpertiseDropdownList = [];
      }
    );
  }

  openFileSelector(index: number): void {
    const fileInput = document.getElementById('fileInput' + index) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  isCollapsed(index: number): boolean {
    return this.collapsedItems[index] === true;
  }

  toggleCollapse(index: number): void {
    this.collapsedItems[index] = !this.collapsedItems[index];
  }
}
