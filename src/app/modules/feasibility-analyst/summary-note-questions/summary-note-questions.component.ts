import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SummaryService } from 'src/app/services/summary/summary.service';

@Component({
  selector: 'app-summary-note-questions',
  templateUrl: './summary-note-questions.component.html',
  styleUrls: ['./summary-note-questions.component.scss']
})
export class SummaryNoteQuestionsComponent {


  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  summaryquestionList: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  summary = {
    questionName: new FormControl("", Validators.required),
    question: new FormControl("", Validators.required),
    instructions: new FormControl("", Validators.required),
    weightage: new FormControl("", Validators.required),
    //comment: new FormControl("", Validators.required),
    refrenceDocument: new FormControl("", Validators.required),
    projectId: new FormControl("", Validators.required),
    summaryQuestionFor: new FormControl("", Validators.required),
    // deadline: new FormControl("", Validators.required),
  }

  summaryForm: FormGroup;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private summaryService: SummaryService,

  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    this.summaryForm = new FormGroup(this.summary);
    this.summaryForm.controls['projectId'].setValue(this.projectId)
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSummaryList()
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
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  getSummaryList() {
    this.projectService.getSummaryQuestionList(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.summaryquestionList = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  submitForm() {
    this.summaryForm.markAllAsTouched();
    if (this.summaryForm.invalid) {
      return this.notificationService.showError('Please Fill All Summary Details.');
    }

    console.log('Form Value:', this.summaryForm.value);  // Debugging line

    this.showLoader = true;
    this.summaryService.addSummary(this.summaryForm.value).subscribe({
      next: (response) => {
        if (response?.status === true) {
          this.showLoader = false;
          this.getSummaryList();
          this.notificationService.showSuccess('question add successfully !');
          window.location.reload();
         
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      error: (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    });
  }

  editSummary(details: any) {
    console.log('adasdadadadadasdasd', details)
  }


  deleteSummary(summaryId?: string) {
    this.summaryService.deleteSummary(summaryId).subscribe((response) => {
      if (response?.status == true) {
        this.getSummaryList();
      } else {
        this.notificationService.showError(response?.message || 'Error');
      }
    }, (error) => {
      this.notificationService.showError(error?.message || 'Something went wrong !');
    })
  }
  detailPage() {
    this.router.navigate(['/feasibility-user/minimum-eligibility-form'], { queryParams: { id: this.projectId } });
  }
}
