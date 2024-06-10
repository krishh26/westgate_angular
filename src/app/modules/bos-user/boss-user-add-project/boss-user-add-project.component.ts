import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-boss-user-add-project',
  templateUrl: './boss-user-add-project.component.html',
  styleUrls: ['./boss-user-add-project.component.scss']
})
export class BossUserAddProjectComponent {

  addEditProjectForm = {
    projectName: new FormControl("", Validators.required),
    BOSID: new FormControl("", Validators.required),
    publishDate: new FormControl(this.getCurrentDate(), Validators.required),
    website: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    industry: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required),
    link: new FormControl("", Validators.required),
    periodOfContractStart: new FormControl("", Validators.required),
    periodOfContractEnd: new FormControl("", Validators.required),
    value: new FormControl("", Validators.required),
    projectType: new FormControl("", Validators.required),
    mailID: new FormControl("", Validators.required),
    clientType: new FormControl("", Validators.required),
    clientName: new FormControl("", Validators.required),

    submission: new FormControl("", Validators.required),
    dueDate: new FormControl("12/9/2001", Validators.required),
  }

  productForm: FormGroup = new FormGroup(this.addEditProjectForm);
  showLoader: boolean = false;
  projectId: string = '';
  categoryList: any = [];
  industryList: any = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private superService: SuperadminService
  ) {
  }

  ngOnInit(): void {
    this.getcategoryList();
    this.getIndustryList();
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    if (this.projectId && this.projectId.length) {
      this.patchProjectValue()
    }

  }

  patchProjectValue() {
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      this.productForm.patchValue(response?.data)
    },
      error => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      })
  }

  getcategoryList() {
    this.showLoader = true;
    this.superService.getCategoryList().subscribe((response) => {
      if (response?.message == "category fetched successfully") {
        this.showLoader = false;
        this.categoryList = response?.data;
      } else {
        // this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  onDropdownChange(event: any) {
    // this.selectedProjectId = event.target.value;
    // this.getProjectRemark()
  }

  getIndustryList() {
    this.showLoader = true;
    this.superService.getIndustryList().subscribe((response) => {
      if (response?.message == "Industry fetched successfully") {
        this.showLoader = false;
        this.industryList = response?.data;
        console.log(this.industryList);
      } else {
        //  this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0, 10);
  }

  // Submit form
  submitForm() {
    this.showLoader = true;
    let payload = {
      data: this.productForm.value
    }
    if (this.projectId) {
      this.projectService.editProject(this.projectId, this.productForm.value).subscribe((response) => {
        if (response.status) {
          this.router.navigate(['/boss-user/project-list']);
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
        error => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
        })
    } else {
      this.projectService.addProject(payload).subscribe((response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.router.navigate(['/boss-user/project-list']);

        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      }, (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      });
    }
  }
}
