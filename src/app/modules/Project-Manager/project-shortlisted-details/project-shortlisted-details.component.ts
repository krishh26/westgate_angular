import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-project-shortlisted-details',
  templateUrl: './project-shortlisted-details.component.html',
  styleUrls: ['./project-shortlisted-details.component.css']
})
export class ProjectShortlistedDetailsComponent {

  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  loginUser: any;
  summaryQuestionList: any;
  casestudylist: any = [];
  selectedSupplier: any;
  userDetail: any;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private projectManagerService: ProjectManagerService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });

    this.loginUser = this.localStorageService.getLogger();
  }

  companyDetails: any = [
    {
      name: "Delphi Services Limited"
    }, {
      name: "Spectrum IT Hub Limited"
    }, {
      name: "Apex IT Solutions"
    }, {
      name: "Big Data Limited"
    }, {
      name: "Saiwen"
    }
  ]

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSummaryQuestion();
  }

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;
        this.casestudylist = response?.data?.casestudy;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  selectSupplier(supplier: any) {
    this.selectedSupplier = supplier

    if (!this.selectedSupplier) {
      return this.notificationService.showError('please select supplier');
    }
    console.log('sadsdd', supplier);

    const data = {
      select: {
        supplierId: this.selectedSupplier?._id,
        companySelect: supplier.company,
        handoverCall: supplier.startDate
      }
    }
    this.projectManagerService.dropUser(data, this.projectId).subscribe((response) => {
      this.notificationService.showSuccess('Successfully select user')
    }, (error) => {
      this.notificationService.showError(error?.message || 'Something went wrong');
    });
  }

  dropUser(details: any) {
    console.log('this is testing data', details);
    if (!details?.reason) {
      return this.notificationService.showError('Please enter reason');
    }

    const data = {
      dropUser: {
        userId: details?._id,
        reason: details?.reason
      }
    }

    this.projectManagerService.dropUser(data, this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.notificationService.showSuccess(response?.message || 'Drop user successfully');
        //this.getUserDetails();
      } else {
        return this.notificationService.showError('Try after some time.');
      }
    }, (error) => {
      this.notificationService.showError(error?.message || 'Error.')
    })
  }

  questionDetails(details: any) {
    localStorage.setItem('ViewQuestionForCoordinator', JSON.stringify(details));
    this.router.navigate(['bid-submission/bid-question-details'], { queryParams: { id: details?._id } });
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
