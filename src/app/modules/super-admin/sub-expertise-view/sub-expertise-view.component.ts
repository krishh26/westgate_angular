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

  // For accordion toggle
  toggleCollapse(index: number): void {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  isCollapsed(index: number): boolean {
    return this.collapsedState[index] || false;
  }

  goBack() {
    this.router.navigate(['/super-admin/expertise-view']);
  }

  getAllSubExpertise(supplier: any): string[] {
    if (!supplier || !Array.isArray(supplier.expertise)) return [];
    // Flatten all subExpertise arrays from all expertise objects
    return supplier.expertise
      .filter((exp: any) => Array.isArray(exp.subExpertise) && exp.subExpertise.length)
      .flatMap((exp: any) => exp.subExpertise)
      .filter((sub: any) => !!sub);
  }
}
