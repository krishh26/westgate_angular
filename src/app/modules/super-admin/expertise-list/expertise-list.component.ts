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

interface ExpertiseItem {
  itemId: string | null;
  name: string;
  type: string;
}

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
  expertiseDropdownOptions: ExpertiseItem[] = [];
  selectedExpertise: ExpertiseItem[] = [];
  newExpertiseType: string = 'technologies';

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

  goBack() {
    this.router.navigate(['/super-admin/super-admin-supplier']);
  }

  getExpertiseDropdownData() {
    this.showLoader = true;
    this.superService.getExpertiseDropdown().subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseDropdownOptions = response.data || [];
          this.expertiseDropdownOptions = this.expertiseDropdownOptions.map(item => {
            return {
              itemId: item.itemId || (item as any)._id,
              name: item.name,
              type: item.type || 'technologies'
            };
          });
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
          this.expertiseList = response?.data?.expertise.map((item: any) => ({
            id: item?.itemId,
            name: item?.name
          }));
          console.log(this.expertiseList);

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
    if (!this.selectedExpertise || this.selectedExpertise.length === 0) {
      this.notificationService.showError('Please select at least one expertise');
      return;
    }

    if (!this.supplierID) {
      this.notificationService.showError('Supplier ID is missing, cannot save expertise.');
      return;
    }

    const expertiseData = {
      supplierId: this.supplierID,
      expertise: this.selectedExpertise
    };

    this.superService.addExpertiseandSubExpertise(expertiseData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Expertise added successfully!');
          this.selectedExpertise = [];

          // Try to close the modal
          const modalElement = document.getElementById('addExpertiseModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }

          // Reload page after a short delay to ensure notification is shown
          setTimeout(() => {
            window.location.reload();
          }, 500);
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

  onAddTag = (name: string) => {
    if (!this.newExpertiseType) {
      this.notificationService.showError('Please select expertise type');
      return null;
    }

    const expertiseType = this.newExpertiseType;

    const newExpertise: ExpertiseItem = {
      name: name,
      type: expertiseType,
      itemId: null
    };

    // Make API call to create custom expertise
    this.showLoader = true;
    this.superService.createCustomExpertise({
      name: name,
      type: expertiseType
    }).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (response?.status) {
          // Update the itemId with the returned ID
          newExpertise.itemId = response.data._id || response.data.itemId;
          this.notificationService.showSuccess('New expertise added successfully');
          return newExpertise;
        } else {
          this.notificationService.showError(response?.message || 'Failed to create expertise');
          return null;
        }
      },
      (error: any) => {
        this.showLoader = false;
        this.notificationService.showError(error?.message || 'Failed to create expertise');
        return null;
      }
    );

    // Return the new expertise object so it can be added to the list while API call is in progress
    return newExpertise;
  }

  deleteExpertise(expertise: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this expertise?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        const expertiseId = expertise.id;
        console.log(expertise);

        this.superService.deleteExpertise(expertiseId, this.supplierID).subscribe(
          (response: any) => {
            if (response?.status === true) {
              this.showLoader = false;
              this.notificationService.showSuccess('Expertise successfully deleted');
              this.getSupplierdata(); // refresh list
            } else {
              this.showLoader = false;
              this.notificationService.showError(response?.message || 'Failed to delete expertise');
            }
          },
          (error: any) => {
            this.showLoader = false;
            this.notificationService.showError(error?.message || 'An error occurred while deleting expertise');
          }
        );
      }
    });
  }
}
