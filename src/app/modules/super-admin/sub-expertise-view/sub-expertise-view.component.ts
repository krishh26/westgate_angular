import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sub-expertise-view',
  templateUrl: './sub-expertise-view.component.html',
  styleUrls: ['./sub-expertise-view.component.scss']
})
export class SubExpertiseViewComponent implements OnInit {
  expertiseName: string = '';
  subExpertiseList: any[] = [];
  totalRecords: number = pagination.totalRecords;
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  viewDocs: any;
  showLoader: boolean = false;
  files: any = [];

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private superService: SuperadminService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.expertiseName = params['expertiseName'];
      this.getSubExpertise();
    });
  }

  getSubExpertise() {
    if (!this.expertiseName) {
      console.error('Expertise name is missing');
      return;
    }

    this.superService.getExpertiseList().subscribe(
      (response) => {
        if (response?.status) {
          const matchingExpertises = response?.data?.filter((item: any) => item.name === this.expertiseName);

          if (matchingExpertises && matchingExpertises.length > 0) {
            const allSubExpertises = new Set<string>();

            matchingExpertises.forEach((expertise: any) => {
              if (expertise.subExpertise && Array.isArray(expertise.subExpertise)) {
                expertise.subExpertise.forEach((sub: string) => allSubExpertises.add(sub));
              }
            });

            this.subExpertiseList = Array.from(allSubExpertises);
            this.totalRecords = this.subExpertiseList.length;
          } else {
            console.error(`Expertise with name "${this.expertiseName}" not found`);
            this.subExpertiseList = [];
          }
        } else {
          console.error('Error fetching expertise data:', response?.message);
          this.subExpertiseList = [];
        }
      },
      (error) => {
        console.error('Error fetching sub-expertise:', error);
        this.subExpertiseList = [];
      }
    );
  }

  viewUploadedDocuments(subExpertise: string) {
    console.log('Viewing documents for:', subExpertise);

    this.viewDocs = this.files?.filter((file: any) => file?.subExpertise === subExpertise);

    if (!this.viewDocs || this.viewDocs.length === 0) {
      this.notificationService.showInfo(`No files available for ${subExpertise}`);
      this.viewDocs = [];

      const modalElement = document.getElementById('viewAllDocuments');
      if (modalElement) {
        this.modalService.open(modalElement, { centered: true });
      }
      return;
    }

    const modalElement = document.getElementById('viewAllDocuments');
    if (modalElement) {
      this.modalService.open(modalElement, { centered: true });
    }
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

  goBack() {
    this.router.navigate(['/super-admin/expertise-list']);
  }
}
