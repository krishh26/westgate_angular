import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-resources-view-details',
  templateUrl: './resources-view-details.component.html',
  styleUrls: ['./resources-view-details.component.scss']
})
export class ResourcesViewDetailsComponent implements OnInit {
  resourceName: string = '';
  resourceList: any[] = [];
  filteredResourceList: any[] = [];
  totalRecords: number = pagination.totalRecords;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  viewDocs: any[] = [];
  showLoader: boolean = false;
  files: any = [];
  searchText: string = '';
  selectedResource: any = null;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resourceName = params['resourceName'];
      if (params['resourceList']) {
        try {
          this.resourceList = JSON.parse(params['resourceList']);

          // Process and enhance the resource data
          this.resourceList.forEach((resource: any) => {
            // Ensure active status has a default value
            resource.active = resource.active !== undefined ? resource.active : true;

            // Format dates properly if they exist
            if (resource.inactiveDate) {
              // Convert string date to Date object if needed
              if (typeof resource.inactiveDate === 'string') {
                resource.inactiveDate = new Date(resource.inactiveDate);
              }
            }

            // Format start date if it exists
            if (resource.startDate) {
              if (typeof resource.startDate === 'string') {
                resource.startDate = new Date(resource.startDate);
              }
            }

            // Ensure arrays are properly initialized
            resource.technicalSkills = resource.technicalSkills || [];
            resource.languagesKnown = resource.languagesKnown || [];
            resource.softSkills = resource.softSkills || [];
            resource.certifications = resource.certifications || [];
            resource.previousEmployers = resource.previousEmployers || [];
            resource.roleId = resource.roleId || [];
          });

          this.filteredResourceList = [...this.resourceList];
          this.totalRecords = this.resourceList.length;

          console.log('Processed resource list:', this.resourceList);
        } catch (error) {
          console.error('Error parsing resource list:', error);
          this.resourceList = [];
        }
      }
    });
  }

  searchResources() {
    if (!this.searchText.trim()) {
      this.filteredResourceList = [...this.resourceList];
      return;
    }

    const searchTerm = this.searchText.toLowerCase().trim();
    this.filteredResourceList = this.resourceList.filter(item =>
      item.name?.toLowerCase().includes(searchTerm) ||
      item.supplierCount?.toString().includes(searchTerm)
    );
  }

  viewDetails(resource: any): void {
    this.selectedResource = resource;
  }

  viewUploadedDocuments(resource: any) {
    console.log('Viewing documents for:', resource.name);

    this.viewDocs = resource.documents || [];

    if (!this.viewDocs || this.viewDocs.length === 0) {
      this.notificationService.showInfo(`No files available for ${resource.name}`);
      this.viewDocs = [];

      const modalElement = document.getElementById('viewAllDocuments');
      if (modalElement) {
        this.modalService.open(modalElement, { centered: true });
      }
      return;
    }

    const modalElement = document.getElementById('viewAllDocuments');
    if (modalElement) {
      this.modalService.open(modalElement, { centered: true });
    }
  }

  deleteDoc(docId: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.showLoader = true;
      this.spinner.show();

      this.superService.deleteDocumentResource(docId).subscribe(
        (response: any) => {
          if (response?.status === true) {
            this.showLoader = false;
            this.notificationService.showSuccess('Document successfully deleted');
            this.viewDocs = this.viewDocs.filter(doc => doc._id !== docId);
          } else {
            this.showLoader = false;
            this.notificationService.showError(response?.message);
          }
          this.spinner.hide();
        },
        (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.error?.message || error?.message);
          this.spinner.hide();
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/super-admin/resources-view']);
  }
}
