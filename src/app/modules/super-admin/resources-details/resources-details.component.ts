import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resources-details',
  templateUrl: './resources-details.component.html',
  styleUrls: ['./resources-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ResourcesDetailsComponent implements OnInit {
  candidateDetails: any = null;
  showLoader: boolean = false;
  supplierID: string = '';
  supplierData: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private superService: SuperadminService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const storedData = localStorage.getItem("supplierData");
    if (storedData) {
      this.supplierData = JSON.parse(storedData);
      this.supplierID = this.supplierData?._id;
    }

    this.route.queryParams.subscribe(params => {
      if (params['candidateId']) {
        this.getCandidateDetails(params['candidateId']);
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
            this.router.navigate(['/super-admin/resources-list']);
            //this.getCandidatesList();
          } else {
            this.notificationService.showError(response?.message);
          }
        }, (error) => {
          this.notificationService.showError(error?.message);
        });
      }
    });
  }


  getCandidateDetails(candidateId: string) {
    this.showLoader = true;
    // Get candidates list from localStorage
    const candidatesList = localStorage.getItem('candidatesList');
    if (candidatesList) {
      const candidates = JSON.parse(candidatesList);
      // Find the candidate with matching ID
      this.candidateDetails = candidates.find((candidate: any) => candidate._id === candidateId);

      if (this.candidateDetails) {
        this.showLoader = false;
      } else {
        this.showLoader = false;
        this.notificationService.showError('Candidate details not found');
      }
    } else {
      this.showLoader = false;
      this.notificationService.showError('No candidates data available');
    }
  }

  goBack() {
    this.router.navigate(['/super-admin/resources-list']);
  }

  // Helper method to check if roleId is an array
  isRoleArray(): boolean {
    return this.candidateDetails?.roleId && Array.isArray(this.candidateDetails.roleId);
  }
}
