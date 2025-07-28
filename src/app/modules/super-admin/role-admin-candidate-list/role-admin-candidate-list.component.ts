import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-role-admin-candidate-list',
  templateUrl: './role-admin-candidate-list.component.html',
  styleUrls: ['./role-admin-candidate-list.component.scss']
})
export class RoleAdminCandidateListComponent implements OnInit {
  allCandidates: any[] = [];
  candidates: any[] = [];
  roleId: string = '';
  roleName: string = '';
  loading: boolean = false;
  error: string = '';
  showLoader: boolean = false;

  // Pagination properties
  totalRecords: number = 0;
  pagesize: number = 10;
  page: number = 1;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private superadminService: SuperadminService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roleId = params.get('roleId') || '';
      this.route.queryParamMap.subscribe(qp => {
        this.roleName = qp.get('name') || '';
      });
      if (this.roleId) {
        this.loadCandidates();
      }
    });
  }

  loadCandidates(): void {
    this.loading = true;
    this.error = '';
    this.superadminService.getCandidatesByRole(this.roleId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status && response.data) {
          this.allCandidates = response.data;
          this.totalRecords = this.allCandidates.length;
          this.paginate(1); // Show first page
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
    // Find the candidate data from the candidates array
    const candidateData = this.allCandidates.find(c => c._id === candidateId);
    if (candidateData) {
      // Store the candidate data in localStorage
      localStorage.setItem('editCandidateData', JSON.stringify(candidateData));
      // Navigate to the edit page with the correct path
      this.router.navigate(['super-admin/admin-data-edit-candidate'], {
        queryParams: { candidateId: candidateId }
      }).then(() => {
        // Force a reload of the component
        window.location.reload();
      });
    }
  }

  editSupplier(supplierId: string): void {
    this.router.navigate(['/super-admin/supplier-profile-edit', supplierId]);
  }

  getRoleNames(roles: any[]): string {
    if (!roles || roles.length === 0) return '-';
    return roles.map((role: any) => role.name).join(', ');
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

  paginate(page: number) {
    this.page = page;
    const start = (page - 1) * this.pagesize;
    const end = start + this.pagesize;
    this.candidates = this.allCandidates.slice(start, end);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
