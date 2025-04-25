import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';


@Component({
  selector: 'app-expertise-view-bid-manager',
  templateUrl: './expertise-view-bid-manager.component.html',
  styleUrls: ['./expertise-view-bid-manager.component.scss']
})
export class ExpertiseViewBidManagerComponent {
  @ViewChild('viewDocumentsModal', { static: false }) viewDocumentsModal!: TemplateRef<any>;
  expertiseList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  showLoader: boolean = false;
  viewDocs: any;
  supplierFiles: any = [];
  supplierDetails: any = [];
  supplierData: any = [];
  supplierID: string = '';
  supplierList: any = [];
  expertiseWiseSupplierList: any = [];
  searchText: any;
  myControl = new FormControl();
  startDate: string = '';
  endDate: string = '';
  dropdownData: any[] = [];
  selectedType: string = '';
  currentList: any[] = [];


  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    public modalService: NgbModal,
    private http: HttpClient
  ) { }

  ngOnInit() {
    const storedData = localStorage.getItem("supplierData");
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    if (storedData) {
      this.supplierData = JSON.parse(storedData);
      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }

    // Check if data was modified in sub-expertise-view
    const dataModified = localStorage.getItem('expertiseDataModified');
    if (dataModified === 'true') {
      // Clear the flag
      localStorage.removeItem('expertiseDataModified');
    }

    // Load all data without specifying type
    this.fetchDropdownData('');
  }

  navigateToSupplier() {
    this.router.navigate(['/super-admin/super-admin-supplier']);
  }

  navigateToSubExpertise(item: any) {
    // Always ensure we have the complete data to pass
    const queryParams: any = {
      expertiseName: item.expertise || item.name
    };

    // Make sure we have the subExpertiseList data
    if (item.subExpertiseList && Array.isArray(item.subExpertiseList)) {
      queryParams.subExpertiseList = JSON.stringify(item.subExpertiseList);
    } else {
      // If we don't have subExpertiseList, send an empty array to avoid API call
      queryParams.subExpertiseList = JSON.stringify([]);
    }

    // Add expertiseId for reference only
    if (item._id) {
      queryParams.expertiseId = item._id;
    }

    this.router.navigate(['/project-manager/project/sub-expertise-view-bid-manager'], {
      queryParams: queryParams
    });
  }

  applyDateFilter() {
    // Use the fetchDropdownData method with empty type
    // This will now filter out items with zero supplier counts
    this.fetchDropdownData('');
  }

  searchtext() {
    this.showLoader = true;
    // Get all data without type filter
    // This will now filter out items with zero supplier counts
    this.fetchDropdownData('');
  }

  getExpertise() {
    this.showLoader = true;
    const params = {
      startDate: this.startDate,
      endDate: this.endDate,
      search: this.searchText?.trim() || ''
    };

    this.superService.getExpertiseList(params).subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseList = response?.data || [];

          // Filter out items with totalSupplierCount of 0
          this.currentList = this.expertiseList.filter((item: any) => {
            return item.totalSupplierCount > 0;
          });

          this.selectedType = '';
        } else {
          this.expertiseList = [];
          this.currentList = [];
          console.error('Failed to fetch supplier data:', response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        this.expertiseList = [];
        this.currentList = [];
        console.error('Error fetching supplier data:', error);
        this.showLoader = false;
      }
    );
  }

  getSupplierdetail() {
    this.showLoader = true;
    this.supplierService.getSupplierDetails(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.supplierDetails = response.data;
          this.showLoader = false;
          this.supplierFiles = response.files;

        } else {
          console.error('Failed to fetch supplier data:', response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
        this.showLoader = false;
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

        this.superService.deleteDocumentExpertise(fileId).subscribe(
          (response: any) => {
            if (response?.status === true) {
              this.showLoader = false;
              this.notificationService.showSuccess('Document successfully deleted');
              window.location.reload(); // Optional: Refresh data
            } else {
              this.showLoader = false;
              this.notificationService.showError(response?.message);
            }
          },
          (error) => {
            this.showLoader = false;
            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }

  showDocuments(item: any) {
    const expertise = item?.expertise;
    if (!expertise) {
      console.error('Expertise is missing');
      return;
    }

    this.showLoader = true;
    this.superService.getSupplierListsExpertiseWise({ expertise }).subscribe(
      (response) => {
        if (response?.status) {
          const data = response?.data || [];
          this.expertiseWiseSupplierList = data.map((entry: any) => ({
            name: entry?.supplier?.name || 'Unknown',
            supplierId: entry?.supplier?._id,
            files: entry?.files || []
          }));
        } else {
          this.expertiseWiseSupplierList = [];
          console.error('Failed to fetch supplier data:', response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
        this.expertiseWiseSupplierList = [];
        this.showLoader = false;
      }
    );
  }


  viewSupplierDocuments(supplier: any) {
    this.supplierFiles = supplier.files;
    this.modalService.open(this.viewDocumentsModal); // Open new modal using template reference
  }

  clearFilters() {
    this.startDate = '';
    this.endDate = '';
    this.searchText = '';

    // Get all data without type filter
    this.fetchDropdownData('');
  }

  fetchDropdownData(type: string) {
    this.showLoader = true;

    // Build the URL with search and date parameters
    let url = `${environment.baseUrl}/web-user/drop-down`;
    let params = [];

    if (this.searchText) {
      params.push(`search=${this.searchText.trim()}`);
    }

    if (this.startDate) {
      params.push(`startDate=${this.startDate}`);
    }

    if (this.endDate) {
      params.push(`endDate=${this.endDate}`);
    }

    // Add query string if we have parameters
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response?.status) {
          // Get all data
          this.dropdownData = response.data || [];

          // Filter out items with totalSupplierCount of 0
          this.currentList = this.dropdownData.filter((item: any) => {
            return item.totalSupplierCount > 0;
          });

          this.selectedType = ''; // Clear selected type
          //this.notificationService.showSuccess(`${this.selectedType} data loaded successfully`);
        } else {
          this.dropdownData = [];
          this.currentList = [];
          this.notificationService.showError(response?.message || 'Failed to fetch dropdown data');
          console.error('Failed to fetch dropdown data:', response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        this.dropdownData = [];
        this.currentList = [];
        this.notificationService.showError('Error fetching dropdown data');
        console.error('Error fetching dropdown data:', error);
        this.showLoader = false;
      }
    );
  }

  formatTypeName(type: string): string {
    switch (type) {
      case 'technologies':
        return 'Technology';
      case 'product':
        return 'Products';
      case 'domain':
        return 'Domain';
      case 'other':
        return 'Other';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  getTypeValue(displayName: string): string {
    switch (displayName) {
      case 'Technology':
        return 'technologies';
      case 'Products':
        return 'product';
      case 'Domain':
        return 'domain';
      case 'Other':
        return 'other';
      default:
        return displayName.toLowerCase();
    }
  }
}
