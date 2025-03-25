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
import { NgxSpinnerService } from 'ngx-spinner';

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
  roleId: string = '';

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    public modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // Get roleId from localStorage if available
    const savedRoleId = localStorage.getItem('selectedRoleId');

    this.route.queryParams.subscribe(params => {
      if (params['roleId']) {
        // If roleId is in URL, save it and use it
        this.roleId = params['roleId'];
        localStorage.setItem('selectedRoleId', this.roleId);
        this.getRoleWiseCandidates();
      } else if (savedRoleId) {
        // If no roleId in URL but exists in localStorage, restore it
        this.roleId = savedRoleId;
        // Update URL with the saved roleId
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { roleId: this.roleId },
          queryParamsHandling: 'merge'
        });
        this.getRoleWiseCandidates();
      } else {
        // If no roleId anywhere, redirect to roles list
        this.router.navigate(['/super-admin/role-wise-resources-list']);
      }
    });

    this.myControl.valueChanges.subscribe((res: any) => {
      this.searchText = res?.toLowerCase();
      this.getRoleWiseCandidates();
    });
  }

  getRoleWiseCandidates() {
    this.loading = true;
    this.spinner.show();

    // Create query string with parameters
    const queryString = `?page=${this.page}&limit=${this.pagesize}${this.searchText ? `&search=${this.searchText}` : ''}`;

    this.superService.getCandidatesByRole(this.roleId + queryString).subscribe({
      next: (response) => {
        if (response?.status) {
          this.candidatesList = response.data || [];
          this.totalRecords = response.totalRecords || 0;
        } else {
          this.notificationService.showError('Failed to fetch candidates data');
        }
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error fetching candidates:', error);
        this.notificationService.showError(error?.message || 'Error fetching candidates');
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  pageChanged(event: any) {
    this.page = event;
    this.updateUrlWithParams();
    this.getRoleWiseCandidates();
  }

  openAddResourceModal() {
    this.modalService.open(ResourcesAddBulkComponent, { size: 'xl' });
  }

  viewCandidateDetails(candidate: any) {
    this.router.navigate(['/super-admin/resources-view-details'], {
      queryParams: {
        resourceName: candidate.fullName,
        resourceList: JSON.stringify([{
          name: candidate.fullName,
          supplierCount: 1,
          details: {
            jobTitle: candidate.jobTitle,
            experience: candidate.totalExperience,
            qualification: candidate.highestQualification,
            yearOfGraduation: candidate.yearOfGraduation,
            gender: candidate.gender,
            nationality: candidate.nationality,
            technicalSkills: candidate.technicalSkills,
            languages: candidate.languagesKnown,
            hourlyRate: candidate.hourlyRate,
            workingHours: candidate.workingHoursPerWeek,
            availableFrom: candidate.availableFrom
          }
        }])
      }
    });
  }

  searchtext() {
    this.page = 1;
    this.updateUrlWithParams();
    this.getRoleWiseCandidates();
  }

  // Add new method to update URL params
  private updateUrlWithParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        roleId: this.roleId,
        page: this.page,
        search: this.searchText || null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Update ngOnDestroy to clean up if needed
  ngOnDestroy() {
    // Optionally clear the stored roleId when leaving the component
    // Uncomment if you want to clear it when leaving the page
    // localStorage.removeItem('selectedRoleId');
  }
}
