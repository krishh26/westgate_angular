import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-boss-user-expertise-list',
  templateUrl: './boss-user-expertise-list.component.html',
  styleUrls: ['./boss-user-expertise-list.component.scss']
})
export class BossUserExpertiseListComponent {
  expertiseList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  showLoader: boolean = false;
  supplierID: string = '';
  supplierData: any = [];
  selectedFiles: File[] = [];
  supplierDetails: any = [];
  viewDocs: any;
  supplierFiles: any = [];
  newExpertise: string = '';
  hideOtherTabs: boolean = false;

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    // Check if the hideOtherTabs flag is set in localStorage
    this.hideOtherTabs = localStorage.getItem('hideOtherTabs') === 'true';

    if (this.hideOtherTabs) {
      // Redirect to the Historical Data tab if the flag is set
      this.router.navigate(['/boss-user/admin-case-study-list']);
      return;
    }

    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);
      this.supplierID = this.supplierData?._id;
      this.getSupplierdata();
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getSupplierdetail();
  }

  getSupplierdata() {
    this.showLoader = true;
    this.supplierService.getSupplierDetails(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseList = response?.expertiseCount.map((item: any) => item.name);
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

  navigateToSubExpertise(expertise: any) {
    this.router.navigate(['/boss-user/sub-expertise-list'], {
      queryParams: {
        expertiseName: expertise,
        supplierId: this.supplierID
      }
    });
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
              window.location.reload();
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

  saveExpertise() {
    if (!this.newExpertise?.trim()) {
      this.notificationService.showError('Please enter an expertise name');
      return;
    }

    if (!this.supplierID) {
      this.notificationService.showError('Supplier ID is missing, cannot save expertise.');
      return;
    }

    const expertiseData = {
      supplierId: this.supplierID,
      expertise: this.newExpertise.trim(),
      subExpertise: []
    };

    this.superService.addExpertiseandSubExpertise(expertiseData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Expertise added successfully!');
          this.newExpertise = '';
          this.getSupplierdata();
          window.location.reload();
          const modalElement = document.getElementById('addExpertiseModal');
          if (modalElement) {
            const modalInstance = new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
        } else {
          this.notificationService.showError(response?.message || 'Failed to add expertise');
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.message || 'Failed to add expertise');
      }
    );
  }
}

