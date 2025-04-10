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

@Component({
  selector: 'app-boss-user-expertise-view',
  templateUrl: './boss-user-expertise-view.component.html',
  styleUrls: ['./boss-user-expertise-view.component.scss']
})
export class BossUserExpertiseViewComponent {
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


  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    public modalService: NgbModal, // Changed from private to public
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
    this.getExpertise();
    // this.getSupplierList();
  }

  navigateToSupplier() {
    this.router.navigate(['/boss-user/supplier']);
  }

  navigateToSubExpertise(item: any) {
    this.router.navigate(['/boss-user/sub-expertise-view'], {
      queryParams: {
        expertiseName: item.expertise,
        subExpertiseList: JSON.stringify(item.subExpertiseList)
      }
    });
  }

  applyDateFilter() {
    this.showLoader = true;
    const params = {
      startDate: this.startDate,
      endDate: this.endDate,
      search: this.searchText?.trim() || ''
    };

    this.superService.getExpertiseList(params).subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseList = response?.data;
          this.totalRecords = response?.totalRecords;
        } else {
          console.error('Failed to fetch supplier data:', response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
        this.showLoader = false;
      }
    );
  }

  searchtext() {
    this.showLoader = true;

    const params = {
      search: this.searchText?.trim() || '',
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.superService.getExpertiseList(params).subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseList = response?.data;
          this.totalRecords = response?.totalRecords;
        } else {
          console.error('Failed to fetch supplier data:', response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching supplier data:', error);
        this.showLoader = false;
      }
    );
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
          this.expertiseList = response?.data;
        } else {
          console.error('Failed to fetch supplier data:', response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
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
    this.getExpertise();
  }

}

