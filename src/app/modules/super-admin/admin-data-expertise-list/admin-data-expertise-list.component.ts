import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-admin-data-expertise-list',
  templateUrl: './admin-data-expertise-list.component.html',
  styleUrls: ['./admin-data-expertise-list.component.scss']
})
export class AdminDataExpertiseListComponent implements OnInit {
  expertiseName: string = '';
  suppliers: any[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private superadminService: SuperadminService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.expertiseName = params.get('expertiseName') || '';
      if (this.expertiseName) {
        this.fetchSuppliers();
      }
    });
  }

  fetchSuppliers() {
    this.loading = true;
    this.error = '';
    this.superadminService.getSuppliersByExpertise(this.expertiseName).subscribe({
      next: (res) => {
        this.suppliers = res?.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to fetch suppliers';
        this.loading = false;
      }
    });
  }

  editSupplier(supplierId: string) {
    this.router.navigate(['/super-admin/supplier-user-profile-edit', supplierId]);
  }
}
