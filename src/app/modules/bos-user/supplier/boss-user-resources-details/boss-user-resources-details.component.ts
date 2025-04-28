import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boss-user-resources-details',
  templateUrl: './boss-user-resources-details.component.html',
  styleUrls: ['./boss-user-resources-details.component.scss']
})
export class BossUserResourcesDetailsComponent {
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
    this.router.navigate(['/boss-user/resources-add'], {
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
            this.router.navigate(['/boss-user/resources-list']);
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
    this.router.navigate(['/boss-user/resources-list']);
  }

  // Helper method to check if roleId is an array
  isRoleArray(): boolean {
    return this.candidateDetails?.roleId && Array.isArray(this.candidateDetails.roleId);
  }

  // Get current role name from role ID
  getCurrentRoleName(): string {
    if (!this.candidateDetails?.currentRole) {
      return '';
    }

    // If currentRole is already an object with name property
    if (typeof this.candidateDetails.currentRole === 'object' && this.candidateDetails.currentRole?.name) {
      return this.candidateDetails.currentRole.name;
    }

    // If currentRole is an ID, find the matching role from roleId array
    if (this.candidateDetails.roleId && Array.isArray(this.candidateDetails.roleId)) {
      const matchingRole = this.candidateDetails.roleId.find((role: any) => {
        return role._id === this.candidateDetails.currentRole;
      });

      if (matchingRole) {
        return matchingRole.name;
      }
    }

    // If single role object
    if (this.candidateDetails.roleId && !Array.isArray(this.candidateDetails.roleId) &&
        this.candidateDetails.roleId._id === this.candidateDetails.currentRole) {
      return this.candidateDetails.roleId.name;
    }

    // Fall back to the ID if we can't find the name
    return this.candidateDetails.currentRole;
  }
}

