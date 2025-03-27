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
  newSubExpertise: string = '';
  subExpertiseTags: string[] = [];

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
  }

  getSupplierdata() {
    this.showLoader = true;
    this.supplierService.getSupplierDetails(this.supplierID).subscribe(
      (response) => {
        if (response?.status) {
          this.expertiseList = response?.expertiseCount.map((item: any) => item.name); // Extract only expertise names
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


  onFilesSelected(event: any, expertise: string) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    this.selectedFiles = Array.from(event.target.files);

    const invalidFiles = this.selectedFiles.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('Only PDF or Word files (.pdf, .doc, .docx) are allowed.');
      this.selectedFiles = [];
      return;
    }

    if (this.selectedFiles.length > 0) {
      this.uploadFiles(expertise);
    }
  }


  uploadFiles(expertise: string) {
    if (!this.selectedFiles.length) {
      this.notificationService.showError('Please select files to upload.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('expertise', expertise);
    formData.append('supplierId', this.supplierID);

    this.superService.uploadByTag(formData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Files uploaded successfully!');
          this.getSupplierdetail();
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
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

  showDocuments(expertise: string) {
    this.viewDocs = this.supplierFiles.filter((file: any) => file.expertise === expertise);
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

  addSubExpertiseTag() {
    if (this.newSubExpertise?.trim()) {
      if (!this.subExpertiseTags.includes(this.newSubExpertise.trim())) {
        this.subExpertiseTags.push(this.newSubExpertise.trim());
      } else {
        this.notificationService.showInfo('This sub expertise already exists');
      }
      this.newSubExpertise = '';
    }
  }

  removeSubExpertiseTag(index: number) {
    this.subExpertiseTags.splice(index, 1);
  }

  saveExpertise() {
    if (!this.newExpertise?.trim()) {
      this.notificationService.showError('Please enter an expertise name');
      return;
    }

    if (this.subExpertiseTags.length === 0) {
      this.notificationService.showError('Please add at least one sub expertise');
      return;
    }

    if (!this.supplierID) {
      this.notificationService.showError('Supplier ID is missing, cannot save expertise.');
      return;
    }

    const expertiseData = {
      supplierId: this.supplierID,
      expertise: this.newExpertise.trim(),
      subExpertise: this.subExpertiseTags
    };

    this.superService.addExpertiseandSubExpertise(expertiseData).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess('Expertise and sub expertise added successfully!');
          this.newExpertise = '';
          this.subExpertiseTags = [];
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
