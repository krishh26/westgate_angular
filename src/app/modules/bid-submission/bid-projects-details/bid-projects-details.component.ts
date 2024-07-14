import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UkWriterService } from 'src/app/services/uk-writer/uk-writer.service';
@Component({
  selector: 'app-bid-projects-details',
  templateUrl: './bid-projects-details.component.html',
  styleUrls: ['./bid-projects-details.component.scss']
})
export class BidProjectsDetailsComponent {

  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  summaryQuestionList: any;
  supplierDetails: any = [];
  supplierId: string = ''

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private ukwriterService: UkWriterService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
      if (params['supplierId']) {
        this.supplierId = params['supplierId']
      }
    });
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSummaryQuestion();
   // this.getSupplierDetails()
  }

  getSupplierDetails() {
    this.ukwriterService.getSupplierListById(this.projectID, this.supplierId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.supplierDetails = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    },
      error => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      })
  }

  formatMilliseconds(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return `${days} days`;
  }

  questionDetails(details: any) {
    localStorage.setItem('ViewQuestionForCoordinator', JSON.stringify(details));
    // this.router.navigate(['/project-coordinator/project-coordinator-question-details'], { queryParams: { id: details?._id } });
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

  getSummaryQuestion() {
    this.showLoader = true;
    this.projectService.getSummaryQuestionList(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.summaryQuestionList = response?.data;
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

  isPdf(url: string): boolean {
    return url?.endsWith('.pdf') || false;
  }

  isWordOrExcel(url: string): boolean {
    return url?.endsWith('.doc') || url?.endsWith('.docx') || url?.endsWith('.xls') || url?.endsWith('.xlsx') || false;
  }

  isImage(url: string): boolean {
    return url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.png') || false;
  }

  getDocumentViewerUrl(url: string): SafeResourceUrl {
    if (this.isWordOrExcel(url)) {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(officeUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }



}
