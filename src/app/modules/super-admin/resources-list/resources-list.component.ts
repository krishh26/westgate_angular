import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { SuperadminCommentModalComponent } from '../superadmin-comment-modal/superadmin-comment-modal.component';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit, AfterViewInit {

  resourcesList: any = [];
  candidatesList: any = [];
  page: number = pagination.page;
  pagesize = 50;
  totalRecords: number = pagination.totalRecords;
  loading: boolean = false;
  supplierID: string = '';
  supplierData: any = [];
  isExecutive: boolean = false;
  expandedSkills: { [key: string]: boolean } = {}; // Track expanded state for each candidate

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

    // Check if executive filter is in URL
    const queryParams = new URLSearchParams(window.location.search);
    this.isExecutive = queryParams.get('executive') === 'true';

    // Get the list of candidates
    this.getCandidatesList();
  }

  goBack() {
    this.router.navigate(['/super-admin/super-admin-supplier']);
  }


  ngAfterViewInit() {
    // Check if we need to refresh the list (set by edit component)
    const refreshNeeded = localStorage.getItem('refreshCandidatesList');
    if (refreshNeeded === 'true') {
      // Clear the flag
      localStorage.removeItem('refreshCandidatesList');
      // Refresh the list
      this.getCandidatesList();
    }
  }

  openCommentModal(item: any) {
    console.log('Opening comment modal for candidate:', item);

    // Create and initialize the modal component
    const modalRef = this.modalService.open(SuperadminCommentModalComponent, { centered: true });
    modalRef.componentInstance.supplier = item;
    modalRef.componentInstance.itemType = 'candidate';
    modalRef.componentInstance.sourceComponent = 'resources-view';

    // Handle the result when modal is closed
    modalRef.result.then(
      (result) => {
        console.log('Modal closed with result:', result);
        // Refresh the data after successful comment submission
        if (result) {
          this.getCandidatesList();
        }
      },
      (reason) => {
        // If dismissed, revert the toggle switch state
        console.log('Modal dismissed:', reason);
        item.active = true; // Revert the toggle if modal was dismissed
      }
    );
  }

  onToggleSwitch(item: any) {
    console.log('Toggle switch clicked, new state:', item.active);

    // If switching to inactive (false), open the comment modal
    if (item.active === false) {
      this.openCommentModal(item);
    } else {
      // If switching to active (true), update directly
      const payload = {
        data: {
          active: true,
          inactiveComment: '' // Clear any previous inactive comment
        }
      };

      console.log('Activating candidate with payload:', payload);

      this.superService.updateCandidate(item._id, payload).subscribe(
        (response: any) => {
          console.log('Activation response:', response);
          if (response?.status) {
            this.notificationService.showSuccess(response?.message || 'Candidate activated successfully');
            this.getCandidatesList();
          } else {
            this.notificationService.showError(response?.message || 'Failed to activate candidate');
            item.active = false; // Revert the toggle if there's an error
          }
        },
        (error: any) => {
          console.error('Error activating candidate:', error);
          this.notificationService.showError(error?.error?.message || 'Error activating candidate');
          // Revert the toggle if there's an error
          item.active = false;
        }
      );
    }
  }


  getCandidatesList() {
    this.loading = true;

    // Only pass isExecutive parameter if it's true
    const executiveParam = this.isExecutive ? this.isExecutive : undefined;

    this.superService.getCandidatesByListId(this.supplierID, this.page, this.pagesize, executiveParam).subscribe(
      (response: any) => {
        this.loading = false;
        if (response && response.status) {
          this.candidatesList = response?.data?.data || [];
          // Initialize expanded state for each candidate
          this.candidatesList.forEach((candidate: any) => {
            this.expandedSkills[candidate._id] = false;
          });
          // Update totalRecords from meta_data
          this.totalRecords = response?.data?.meta_data?.items || 0;
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

    // Create query params object with page
    const queryParams: any = {
      page: this.page
    };

    // Only add executive parameter when it's true
    if (this.isExecutive) {
      queryParams.executive = true;
    }

    // Update URL with the parameters
    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  openAddResourceModal() {
    this.modalService.open(ResourcesAddBulkComponent, { size: 'xl' });
  }

  viewCandidateDetails(candidate: any) {
    this.router.navigate(['/super-admin/resources-details'], {
      queryParams: {
        candidateId: candidate?._id
      }
    });
  }

  editCandidate(candidate: any) {
    // Store the candidate data in localStorage for the edit form
    localStorage.setItem('editCandidateData', JSON.stringify(candidate));
    this.router.navigate(['/super-admin/resources-add'], {
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
          this.notificationService.showError(error?.error?.message || error?.message);
        });
      }
    });
  }

  onExecutiveToggle() {
    // Create query params object
    const queryParams: any = {};

    // Only add executive parameter to URL when it's true
    if (this.isExecutive) {
      queryParams.executive = true;
    }

    // Update URL with the appropriate parameters
    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });

    // Refresh candidate list with new filter
    this.getCandidatesList();
  }

  // Add method to toggle skills visibility
  toggleSkills(candidateId: string) {
    this.expandedSkills[candidateId] = !this.expandedSkills[candidateId];
  }

  // Add method to check if skills are expanded
  isSkillsExpanded(candidateId: string): boolean {
    return this.expandedSkills[candidateId] || false;
  }

}
