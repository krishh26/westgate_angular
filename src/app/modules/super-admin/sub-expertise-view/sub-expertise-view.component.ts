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
  suppliers: any[] = [];
  totalRecords: number = pagination.totalRecords;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  showLoader: boolean = false;

  // Nested accordion states
  supplierCollapsedState: { [key: number]: boolean } = {};
  expertiseCollapsedState: { [supplierIndex: number]: { [expertiseIndex: number]: boolean } } = {};

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
    console.log('Sub-expertise view ngOnInit called');

    // Get expertiseName from query params
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      this.expertiseName = params['expertiseName'];
      console.log('Expertise name from params:', this.expertiseName);

      if (this.expertiseName) {
        console.log('Fetching suppliers for expertise:', this.expertiseName);
        this.fetchSuppliersForExpertise(this.expertiseName);
      } else {
        console.log('No expertise name found in query params');
        this.suppliers = [];
      }
    });
  }

  fetchSuppliersForExpertise(expertiseName: string) {
    this.showLoader = true;
    this.superService.getSuppliersByExpertise(expertiseName).subscribe({
      next: (response) => {
        console.log('API response:', response);
        this.showLoader = false;
        if (response && response.status && response.data) {
          this.suppliers = response.data;
          this.totalRecords = this.suppliers.length;
          console.log('Fetched suppliers:', this.suppliers);
        } else {
          console.error('Invalid API response:', response);
          this.suppliers = [];
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.showLoader = false;
        this.suppliers = [];
      }
    });
  }

  // Supplier level accordion methods
  toggleSupplierCollapse(supplierIndex: number): void {
    this.supplierCollapsedState[supplierIndex] = !this.supplierCollapsedState[supplierIndex];
  }

  isSupplierCollapsed(supplierIndex: number): boolean {
    return this.supplierCollapsedState[supplierIndex] || false;
  }

  // Expertise level accordion methods
  toggleExpertiseCollapse(supplierIndex: number, expertiseIndex: number): void {
    if (!this.expertiseCollapsedState[supplierIndex]) {
      this.expertiseCollapsedState[supplierIndex] = {};
    }
    this.expertiseCollapsedState[supplierIndex][expertiseIndex] = !this.expertiseCollapsedState[supplierIndex][expertiseIndex];
  }

  isExpertiseCollapsed(supplierIndex: number, expertiseIndex: number): boolean {
    return this.expertiseCollapsedState[supplierIndex]?.[expertiseIndex] || false;
  }

  // Helper method to count total documents for a supplier
  getTotalDocumentsCount(supplier: any): number {
    if (!supplier || !supplier.expertise) return 0;
    return supplier.expertise.reduce((total: number, expertise: any) => {
      return total + (expertise.totalFilesCount || 0);
    }, 0);
  }

  goBack() {
    this.router.navigate(['/super-admin/expertise-view']);
  }
}
