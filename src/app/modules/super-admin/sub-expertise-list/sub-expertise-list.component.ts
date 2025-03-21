import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-expertise-list',
  templateUrl: './sub-expertise-list.component.html',
  styleUrls: ['./sub-expertise-list.component.scss']
})
export class SubExpertiseListComponent implements OnInit {

  expertiseName: string = '';
  supplierId: string = '';
  subExpertiseList: any[] = [];
  totalRecords: number = pagination.totalRecords;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  selectedFiles: File[] = [];
  supplierID: string = '';
  viewDocs: any;
  showLoader: boolean = false;
  files : any  = []

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierAdminService,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.expertiseName = params['expertiseName'];
      this.supplierId = params['supplierId'];
      this.getSubExpertise();
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
          // this.getSupplierdetail();
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
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

  viewUploadedDocuments(subExpertise: string) {
    console.log(subExpertise);

    this.viewDocs = this.files?.filter((file: any) => file?.subExpertise === subExpertise);

    if (this.viewDocs?.length === 0) {
      this.notificationService.showInfo(`No files available for ${subExpertise}`);
      return;
    }

    this.modalService.open(document.getElementById('viewAllDocuments'), { centered: true });
  }

  getSubExpertise() {
    this.supplierService.getSupplierDetails(this.supplierId).subscribe(
      (response) => {
        if (response?.status) {
          const expertiseData = response?.data?.expertise?.find((item: any) => item.name === this.expertiseName);
          this.subExpertiseList = expertiseData?.subExpertise || [];
          this.files = response?.files || [];
        }
      },
      (error) => {
        console.error('Error fetching sub-expertise:', error);
      }
    );
  }


}
