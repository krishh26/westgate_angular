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
  filteredSuppliers: any[] = [];
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
        this.filteredSuppliers = [];
      }
    });
  }

  fetchSuppliersForExpertise(expertiseName: string) {
    this.showLoader = true;
    this.spinner.show();

    this.superService.getSuppliersByExpertise(expertiseName).subscribe({
      next: (response) => {
        console.log('API response:', response);
        this.showLoader = false;
        this.spinner.hide();

        if (response && response.status && response.data) {
          this.suppliers = response.data;
          // Filter suppliers to show only those with the specific expertise
          this.filterSuppliersByExpertise(expertiseName);
          this.totalRecords = this.filteredSuppliers.length;
          console.log('Filtered suppliers:', this.filteredSuppliers);
        } else {
          console.error('Invalid API response:', response);
          this.suppliers = [];
          this.filteredSuppliers = [];
        }
      },
      error: (err) => {
        console.error('API error:', err);
        this.showLoader = false;
        this.spinner.hide();
        this.suppliers = [];
        this.filteredSuppliers = [];
      }
    });
  }

  filterSuppliersByExpertise(expertiseName: string) {
    const normalizedExpertiseName = this.normalizeExpertiseName(expertiseName);
    console.log(`Filtering suppliers for expertise: "${expertiseName}" (normalized: "${normalizedExpertiseName}")`);
    console.log(`Total suppliers before filtering: ${this.suppliers.length}`);

    this.filteredSuppliers = this.suppliers.filter(supplier => {
      // Check if supplier has expertise array and if it contains the specific expertise
      if (supplier.expertise && Array.isArray(supplier.expertise)) {
        const hasExpertise = supplier.expertise.some((exp: any) => {
          const expName = exp.name || '';
          const normalizedExpName = this.normalizeExpertiseName(expName);
          const matches = normalizedExpName === normalizedExpertiseName;
          console.log(`Supplier ${supplier.name || 'Unknown'}: expertise "${expName}" (normalized: "${normalizedExpName}") matches "${normalizedExpertiseName}": ${matches}`);
          return matches;
        });

        if (hasExpertise) {
          console.log(`Supplier ${supplier.name || 'Unknown'} has matching expertise: ${expertiseName}`);
        }

        return hasExpertise;
      }

      console.log(`Supplier ${supplier.name || 'Unknown'} has no expertise array`);
      return false;
    }).map(supplier => {
      // Create a filtered version of the supplier with only relevant expertise data
      const filteredSupplier = { ...supplier };

      if (filteredSupplier.expertise && Array.isArray(filteredSupplier.expertise)) {
        // Filter expertise to only show the matching one
        const originalExpertiseCount = filteredSupplier.expertise.length;
        filteredSupplier.expertise = filteredSupplier.expertise.filter((exp: any) => {
          const expName = exp.name || '';
          const normalizedExpName = this.normalizeExpertiseName(expName);
          return normalizedExpName === normalizedExpertiseName;
        });

        console.log(`Supplier ${filteredSupplier.name || 'Unknown'}: filtered from ${originalExpertiseCount} to ${filteredSupplier.expertise.length} expertise items`);

        // Log sub-expertise information for debugging
        filteredSupplier.expertise.forEach((exp: any, index: number) => {
          console.log(`  Expertise ${index + 1}: "${exp.name}"`);
          console.log(`    Sub-expertise count: ${exp.subExpertise ? exp.subExpertise.length : 0}`);
          console.log(`    Sub-expertise with files count: ${exp.subExpertiseWithFiles ? exp.subExpertiseWithFiles.length : 0}`);
          console.log(`    Total files count: ${exp.totalFilesCount || 0}`);
        });
      }

      return filteredSupplier;
    });

    console.log(`Found ${this.filteredSuppliers.length} suppliers with expertise: ${expertiseName}`);

    // Log summary of filtered results
    if (this.filteredSuppliers.length > 0) {
      console.log('Filtered suppliers summary:');
      this.filteredSuppliers.forEach((supplier, index) => {
        console.log(`  ${index + 1}. ${supplier.name || 'Unknown'} - ${supplier.expertise?.length || 0} expertise items`);
      });
    }
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

  // Helper method to get formatted sub-expertise data
  getSubExpertiseData(expertise: any): any[] {
    if (!expertise) return [];

    // If subExpertiseWithFiles exists, use it
    if (expertise.subExpertiseWithFiles && Array.isArray(expertise.subExpertiseWithFiles)) {
      return expertise.subExpertiseWithFiles;
    }

    // If only subExpertise array exists, convert it to the expected format
    if (expertise.subExpertise && Array.isArray(expertise.subExpertise)) {
      return expertise.subExpertise.map((subExpName: string) => ({
        name: subExpName,
        files: [],
        totalFilesCount: 0
      }));
    }

    return [];
  }

  // Helper method to check if expertise has sub-expertise data
  hasSubExpertiseData(expertise: any): boolean {
    return this.getSubExpertiseData(expertise).length > 0;
  }

  // Method to refresh data
  refreshData() {
    if (this.expertiseName) {
      console.log('Refreshing data for expertise:', this.expertiseName);
      this.fetchSuppliersForExpertise(this.expertiseName);
    }
  }

  // Method to handle expertise name variations
  normalizeExpertiseName(name: string): string {
    if (!name) return '';

    // Remove extra spaces and normalize
    return name.trim().toLowerCase();
  }

  goBack() {
    this.router.navigate(['/super-admin/expertise-view']);
  }
}
