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
  selector: 'app-expertise-list',
  templateUrl: './expertise-list.component.html',
  styleUrls: ['./expertise-list.component.scss']
})
export class ExpertiseListComponent {

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
  expertiseDropdownOptions: any[] = [];
  selectedExpertise: string = '';

  constructor(
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);
      this.supplierID = this.supplierData?._id;
    } else {
      console.log("No supplier data found in localStorage");
    }
    this.getSupplierdata();
    this.getSupplierdetail();
    this.getExpertiseDropdownData();
  }

  getExpertiseDropdownData() {
    this.showLoader = true;
    this.superService.getExpertiseDropdown().subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseDropdownOptions = response.data || [];
        } else {
          console.error('Failed to fetch expertise dropdown data:', response?.message);
          this.notificationService.showError('Failed to fetch expertise dropdown data');
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching expertise dropdown data:', error);
        this.notificationService.showError('Error fetching expertise dropdown data');
        this.showLoader = false;
      }
    );
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
    this.router.navigate(['/super-admin/sub-expertise-list'], {
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
    if (!this.selectedExpertise) {
      this.notificationService.showError('Please select an expertise');
      return;
    }

    if (!this.supplierID) {
      this.notificationService.showError('Supplier ID is missing, cannot save expertise.');
      return;
    }

    const expertiseData = {
      supplierId: this.supplierID,
      expertise: this.selectedExpertise,
      subExpertise: []
    };

    this.superService.addExpertiseandSubExpertise(expertiseData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Expertise added successfully!');
          this.selectedExpertise = '';
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

  onItemAddCategory(item: { category: string }): void {
    // // Add type annotation for 'categoryItem'
    // const found = this.categoryList.some((categoryItem: { category: string }) => categoryItem.category === item.category);
    // if (!found) {
    //   this.showLoader = true;
    //   this.projectService.createCategory(item).subscribe((response) => {
    //     if (response?.status == true) {
    //       this.showLoader = false;
    //       this.getcategoryList();

    //     } else {
    //       this.notificationService.showError(response?.message);
    //       this.showLoader = false;
    //     }
    //   }, (error) => {
    //     this.notificationService.showError(error?.message);
    //     this.showLoader = false;
    //   });
    // }
  }


}
