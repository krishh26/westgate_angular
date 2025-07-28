import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperadminService } from '../../../services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-admin-data-candidate-list',
  templateUrl: './admin-data-candidate-list.component.html',
  styleUrls: ['./admin-data-candidate-list.component.scss']
})
export class AdminDataCandidateListComponent implements OnInit {
  candidates: any[] = [];
  technologyName: string = '';
  loading: boolean = false;
  error: string = '';
  showLoader: boolean = false;

    // Pagination properties
  page: number = pagination.page;
  pagesize: number = 10;  // Default page size
  totalRecords: number = pagination.totalRecords;

  // Make Math available in template
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private superadminService: SuperadminService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.technologyName = params['technologyName'];
      if (this.technologyName) {
        this.loadCandidates();
      }
    });
  }

  loadCandidates(): void {
    this.loading = true;
    this.error = '';

    this.superadminService.getCandidatesByTechnology(this.technologyName, this.page, this.pagesize).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status && response.data) {
          // Data comes directly as an array
          this.candidates = response.data;

          // Handle pagination metadata from meta_data object
          if (response.meta_data) {
            this.totalRecords = response.meta_data.items;
            this.pagesize = response.meta_data.page_size;
            this.page = response.meta_data.page;
          } else {
            // Fallback if API doesn't return pagination metadata
            this.totalRecords = this.candidates.length;
          }
        } else {
          this.error = 'Failed to load candidates';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error loading candidates: ' + (error.error?.message || error.message || 'Unknown error');
        console.error('Error loading candidates:', error);
      }
    });
  }

  editCandidate(candidateId: string): void {
    this.router.navigate(['/super-admin/admin-data-edit-candidate', candidateId]);
  }

  editSupplier(supplierId: string): void {
    this.router.navigate(['/super-admin/supplier-profile-edit', supplierId]);
  }

  getRoleNames(roles: any[]): string {
    if (!roles || roles.length === 0) return '-';
    return roles.map((role: any) => role.name).join(', ');
  }

  getTechnicalSkills(skills: string[]): string {
    if (!skills || skills.length === 0) return '-';
    return skills.join(', ');
  }

  getPreviousEmployers(employers: string[]): string {
    if (!employers || employers.length === 0) return '-';
    return employers.join(', ');
  }

  getCertifications(certifications: string[]): string {
    if (!certifications || certifications.length === 0) return '-';
    return certifications.join(', ');
  }

  getLanguages(languages: string[]): string {
    if (!languages || languages.length === 0) return '-';
    return languages.join(', ');
  }

  formatCurrency(amount: number): string {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatUKCurrency(amount: number): string {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  goBack(): void {
    this.router.navigate(['/super-admin/admin-data-settings']);
  }

    // Pagination method
  paginate(page: number) {
    this.page = page;
    this.loadCandidates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
