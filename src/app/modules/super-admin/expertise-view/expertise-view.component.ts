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
  selector: 'app-expertise-view',
  templateUrl: './expertise-view.component.html',
  styleUrls: ['./expertise-view.component.scss']
})
export class ExpertiseViewComponent {
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

    // Load technologies data by default instead of expertise list
    this.fetchDropdownData('technologies');
  }

  navigateToSupplier() {
    this.router.navigate(['/super-admin/super-admin-supplier']);
  }

  navigateToSubExpertise(item: any) {
    this.router.navigate(['/super-admin/sub-expertise-view'], {
      queryParams: {
        expertiseName: item.expertise || item.name,
        subExpertiseList: JSON.stringify(item.subExpertiseList || [])
      }
    });
  }

  applyDateFilter() {
    this.showLoader = true;
    const params = {
      startDate: this.startDate,
      endDate: this.endDate,
      search: this.searchText?.trim() || '',
      page: this.page,
      limit: this.pagesize
    };

    this.superService.getExpertiseList(params).subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseList = response?.data || [];
          this.currentList = this.expertiseList || [];
          this.selectedType = '';
          this.totalRecords = response?.totalRecords;
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

  searchtext() {
    this.showLoader = true;

    // If we are viewing a specific type, search within that type
    if (this.selectedType) {
      const type = this.getTypeValue(this.selectedType);
      // Use fetchDropdownData method to ensure consistent implementation
      this.fetchDropdownData(type);
    } else {
      // Otherwise search in expertise list (should not happen with current implementation)
      const params = {
        search: this.searchText?.trim() || '',
        startDate: this.startDate,
        endDate: this.endDate
      };

      this.superService.getExpertiseList(params).subscribe(
        (response) => {
          if (response?.status) {
            this.expertiseList = response?.data || [];
            this.currentList = this.expertiseList || [];
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
          this.currentList = this.expertiseList || [];
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

    // Refresh the current view based on selected type
    if (this.selectedType === 'Technology') {
      this.fetchDropdownData('technologies');
    } else if (this.selectedType === 'Products') {
      this.fetchDropdownData('product');
    } else if (this.selectedType === 'Domain') {
      this.fetchDropdownData('domain');
    } else {
      // Default to technologies if nothing is selected
      this.fetchDropdownData('technologies');
    }
  }

  fetchDropdownData(type: string) {
    this.showLoader = true;
    // Include search parameter if available
    const url = `${environment.baseUrl}/web-user/drop-down?type=${type}${this.searchText ? '&search=' + this.searchText.trim() : ''}`;

    this.http.get<any>(url).subscribe(
      (response) => {
        if (response?.status) {
          this.dropdownData = response.data || [];
          this.currentList = this.dropdownData || [];
          this.selectedType = this.formatTypeName(type);
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
    switch(type) {
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
    switch(displayName) {
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
