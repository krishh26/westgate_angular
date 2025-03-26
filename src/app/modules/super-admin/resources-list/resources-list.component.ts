import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { SupplierAdminService } from 'src/app/services/supplier-admin/supplier-admin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import Swal from 'sweetalert2';
import { ResourcesAddBulkComponent } from '../resources-add-bulk/resources-add-bulk.component';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit {

  resourcesList: any = [];
  candidatesList: any = [];
  page: number = pagination.page;
  pagesize = pagination.itemsPerPage;
  totalRecords: number = pagination.totalRecords;
  loading: boolean = false;
  supplierID: string = '';
  supplierData: any = [];

  constructor(
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
    // Using a fixed list ID now: '67b60d775c16e4e640eee7dc'
    this.getCandidatesList();
  }

  getCandidatesList() {
    this.loading = true;
    this.superService.getCandidatesByListId(this.supplierID, this.page, this.pagesize).subscribe(
      (response: any) => {
        this.loading = false;
        if (response && response.status) {
          this.candidatesList = response?.data?.data || [];
          this.totalRecords = response?.totalRecords || 0;
          // Store candidates list in localStorage
          localStorage.setItem('candidatesList', JSON.stringify(this.candidatesList));
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch candidate data');
        }
      },
      (error: any) => {
        this.loading = false;
        this.notificationService.showError(error?.message || 'An error occurred while fetching candidate data');
      }
    );
  }

  pageChanged(event: any) {
    this.page = event;
    this.getCandidatesList();
  }

  openAddResourceModal() {
    this.modalService.open(ResourcesAddBulkComponent, { size: 'xl' });
  }

  viewCandidateDetails(candidate: any) {
    this.router.navigate(['/super-admin/resources-details'], {
      queryParams: {
        candidateId: candidate._id
      }
    });
  }

    deleteCandidates(id: any) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00B96F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete!'
      }).then((result: any) => {
        if (result?.value) {
          this.superService.deleteCandidate(id).subscribe((response: any) => {
            if (response?.status == true) {
              this.notificationService.showSuccess('User successfully deleted');
              this.getCandidatesList();
            } else {
              this.notificationService.showError(response?.message);
            }
          }, (error) => {
            this.notificationService.showError(error?.message);
          });
        }
      });
    }

}
