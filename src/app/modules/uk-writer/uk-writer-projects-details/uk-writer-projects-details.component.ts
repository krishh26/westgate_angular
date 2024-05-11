import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { UkWriterService } from 'src/app/services/uk-writer/uk-writer.service';

@Component({
  selector: 'app-uk-writer-projects-details',
  templateUrl: './uk-writer-projects-details.component.html',
  styleUrls: ['./uk-writer-projects-details.component.scss']
})
export class UkWriterProjectsDetailsComponent {

  projectID : string = '';
  supplierId : string = '';
  showLoader: boolean = false;
  projectDetails: any = [];
  supplierDetails: any = [];
  selectedDocument: any;
  summaryquestionList :any


  constructor(private route:ActivatedRoute,
    private projectService:ProjectService,
    private ukwriterService: UkWriterService,
    private router: Router,
    private notificationService: NotificationService,
  ){
    
    this.route.queryParams.subscribe((params) => {
      if(params['id']){
        this.projectID = params['id']
      }
      if(params['supplierId']){
        this.supplierId = params['supplierId']
      }
    });
    this.getProjectDetails()
    this.getSupplierDetails()

  }

  getProjectDetails(){
      this.projectService.getProjectDetailsById(this.projectID).subscribe((response)=>{
        if (response?.status == true) {
          this.showLoader = false;
          this.projectDetails = response?.data;
        this.summaryquestionList = response?.data?.summaryQuestion;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      error=>{
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      })
  }

  getSupplierDetails(){
    this.ukwriterService.getSupplierListById(this.projectID,this.supplierId).subscribe((response)=>{
      if (response?.status == true) {
        this.showLoader = false;
        this.supplierDetails = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    },
    error=>{
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    })
  }

  supplierListPage(){
    localStorage.setItem('UKprojectID' ,this.projectID )
    this.router.navigate(['/uk-writer/uk-writer-supplier-list'], { queryParams: { id: this.projectID } });
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

  questionDetails(details: any) {
    localStorage.setItem('ViewQuestion', JSON.stringify(details));
    this.router.navigate(['/uk-writer/uk-writer-question-details'], { queryParams: { id: details?._id } });
  }
}
