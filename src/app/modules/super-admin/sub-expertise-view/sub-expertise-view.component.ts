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
  // Track which accordion items are collapsed
  collapsedState: { [key: number]: boolean } = {};

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
      const subExpertiseListStr = params['subExpertiseList'];
      if (subExpertiseListStr) {
        this.subExpertiseList = JSON.parse(subExpertiseListStr);
        this.totalRecords = this.subExpertiseList.length;
      }
    });
  }

  viewUploadedDocuments(subExpertise: any) {
    this.viewDocs = subExpertise.files || [];

    if (!this.viewDocs || this.viewDocs.length === 0) {
      this.notificationService.showInfo(`No files available for ${subExpertise.name}`);
      // Don't return early, as we still want to toggle the accordion
    }
  }

  // Toggle the collapse state of an accordion item
  toggleCollapse(index: number): void {
    this.collapsedState[index] = !this.collapsedState[index];
  }

  // Check if an accordion item is collapsed
  isCollapsed(index: number): boolean {
    return this.collapsedState[index] || false;
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
    this.router.navigate(['/super-admin/expertise-view']);
  }
}
