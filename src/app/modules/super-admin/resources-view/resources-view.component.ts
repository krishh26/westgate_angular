import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';
import { ResourcesAddBulkComponent } from '../resources-add-bulk/resources-add-bulk.component';

@Component({
  selector: 'app-resources-view',
  templateUrl: './resources-view.component.html',
  styleUrls: ['./resources-view.component.scss']
})
export class ResourcesViewComponent implements OnInit {

  searchText: any;
  myControl = new FormControl();
  resourcesList: any = [];
  candidatesList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  loading: boolean = false;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    public modalService: NgbModal,
  ) { }

  ngOnInit() {
    // Check for search parameter in the URL
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchText = params['search'];
      }
      this.getCandidatesList();
    });
  }

  getCandidatesList() {
    this.loading = true;
    this.superService.getCandidatesList(this.page, this.pagesize, this.searchText).subscribe(
      (response: any) => {
        this.loading = false;
        if (response && response.status) {
          this.candidatesList = response.data || [];
          this.totalRecords = response.totalRecords || 0;
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch candidate data');
        }
      },
      (error: any) => {
        this.loading = false;
        this.notificationService.showError(error?.message || 'An error occurred while fetching candidate data');
      }
    );
  }

  pageChanged(event: any) {
    this.page = event;
    this.updateUrlQueryParams();
    this.getCandidatesList();
  }

  openAddResourceModal() {
    this.modalService.open(ResourcesAddBulkComponent, { size: 'xl' });
  }

  viewCandidateDetails(candidate: any) {
    // Store candidate details in local storage or state management solution
    // Navigate to details page or open a modal
    console.log('View candidate details', candidate);
  }

  searchtext() {
    this.page = 1; // Reset to first page when searching
    this.updateUrlQueryParams();
    this.getCandidatesList();
  }

  updateUrlQueryParams() {
    // Update URL with search parameter without reloading the page
    const queryParams = this.searchText ? { search: this.searchText } : {};
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
