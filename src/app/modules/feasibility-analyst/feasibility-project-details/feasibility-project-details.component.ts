import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-feasibility-project-details',
  templateUrl: './feasibility-project-details.component.html',
  styleUrls: ['./feasibility-project-details.component.scss']
})
export class FeasibilityProjectDetailsComponent {

  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;

  subContractDocument: any;
  economicalPartnershipQueryFile: any;
  economicalPartnershipResponceFile: any;

  documentUploadType : any = {
    subContractDocument : 'SubContract',
    economicalPartnershipQuery : 'economicalPartnershipQuery',
    economicalPartnershipResponse : 'economicalPartnershipResponse'
  }

  // For check bov
  subContracting: FormControl = new FormControl();

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private feasibilityService: FeasibilityService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
  }
  ngOnInit(): void {
    this.getProjectDetails();
  }

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  openDocument(data: any) {
    this.selectedDocument = data;
  }

  download(imageUrl: string, fileName: string): void {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // You can customize the filename here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  summaryDetail() {
    this.router.navigate(['/feasibility-user/summary-note-questions'], { queryParams: { id: this.projectId } });
  }

  // upload Sub Contract
  uploadDocument(event: any, type: string): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = new FormData();
      data.append('files', file);
      this.feasibilityService.uploadDocument(data).subscribe((response) => {
        if (response?.status) {
          debugger
          if(type == this.documentUploadType.subContractDocument) {
            this.subContractDocument = response?.data;
          }
          if(type == this.documentUploadType.economicalPartnershipQuery) {
            this.economicalPartnershipQueryFile = response?.data;
          }
          if(type == this.documentUploadType.economicalPartnershipResponse) {
            this.economicalPartnershipResponceFile = response?.data;
          }
          return this.notificationService.showSuccess(response?.message);
        } else {
          return this.notificationService.showError(response?.message);
        }
      }, (error) => {
        return this.notificationService.showError(error?.message || "Error while uploading");
      });
    }
  }
}
