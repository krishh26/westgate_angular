import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
  }
  ngOnInit(): void {
    this.getProjectDetails();
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }


  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;
        const dueDate = new Date(this.projectDetails?.dueDate);
        const currentDate = new Date();
        const dateDifference = Math.abs(dueDate.getTime() - currentDate.getTime());
        const formattedDateDifference: string = this.formatMilliseconds(dateDifference);
        this.dateDifference = formattedDateDifference;
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

  summaryDetail(){
    this.router.navigate(['/feasibility-user/summary-note-questions'], { queryParams: { id: this.projectId } });
  }

}
